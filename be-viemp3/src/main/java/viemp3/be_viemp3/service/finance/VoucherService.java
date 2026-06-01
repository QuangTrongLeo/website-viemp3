package viemp3.be_viemp3.service.finance;

import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.finance.VoucherRequest;
import viemp3.be_viemp3.dto.response.finance.VoucherResponse;
import viemp3.be_viemp3.entity.Voucher;
import viemp3.be_viemp3.mapper.finance.VoucherMapper;
import viemp3.be_viemp3.repository.finance.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final EntityQueryService entityService;

    // 1. Lấy tất cả Voucher
    public List<VoucherResponse> getAllVouchers() {
        return VoucherMapper.toResponseList(voucherRepository.findAll());
    }

    // 2. Lấy danh sách Voucher khả dụng (Đã kích hoạt, còn số lượng và trong hạn)
    public List<VoucherResponse> getAvailableVouchers() {
        LocalDateTime now = LocalDateTime.now();
        List<Voucher> vouchers = voucherRepository.findAllByActiveTrueAndQuantityGreaterThanAndEndDateAfter(0, now);
        return VoucherMapper.toResponseList(vouchers);
    }

    // 3. Lấy chi tiết 1 Voucher
    public VoucherResponse getVoucherById(String id) {
        Voucher voucher = entityService.finVoucherById(id);
        return VoucherMapper.toResponse(voucher);
    }

    // 4. Tạo mới Voucher
    @Transactional
    public VoucherResponse createVoucher(VoucherRequest request) {
        LocalDate today = LocalDate.now();

        if (request.getStartDate().isBefore(today)) {
            throw new RuntimeException("Ngày bắt đầu không thể là ngày trong quá khứ");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("Ngày kết thúc không thể trước ngày bắt đầu");
        }

        Voucher voucher = new Voucher();
        voucher.setQuantity(request.getQuantity());
        voucher.setDiscountPercentage(request.getDiscountPercentage());
        voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());
        voucher.setStartDate(request.getStartDate().atStartOfDay());
        voucher.setEndDate(request.getEndDate().atTime(23, 59, 59));
        if (request.getStartDate().isEqual(today)) {
            voucher.setActive(true);
        } else {
            voucher.setActive(false);
        }

        return VoucherMapper.toResponse(voucherRepository.save(voucher));
    }

    // 5. Cập nhật Voucher
    @Transactional
    public VoucherResponse updateVoucher(String id, VoucherRequest request) {
        Voucher voucher = entityService.finVoucherById(id);
        LocalDate today = LocalDate.now();

        if (request.getQuantity() != null) voucher.setQuantity(request.getQuantity());
        if (request.getDiscountPercentage() != null) voucher.setDiscountPercentage(request.getDiscountPercentage());
        if (request.getMaxDiscountAmount() != null) voucher.setMaxDiscountAmount(request.getMaxDiscountAmount());

        if (request.getStartDate() != null) {
            voucher.setStartDate(request.getStartDate().atStartOfDay());
            voucher.setActive(request.getStartDate().isEqual(today) || request.getStartDate().isBefore(today));
        }

        if (request.getEndDate() != null) voucher.setEndDate(request.getEndDate().atTime(23, 59, 59));
        if (request.getActive() != null) voucher.setActive(request.getActive());

        return VoucherMapper.toResponse(voucherRepository.save(voucher));
    }

    // 6. Xóa Voucher (Nên dùng xóa mềm - Soft Delete)
    @Transactional
    public void deleteVoucher(String id) {
        Voucher voucher = entityService.finVoucherById(id);
        voucher.setActive(false);
        voucherRepository.save(voucher);
    }

    // 7. Logic trừ số lượng Voucher
    @Transactional
    public void useVoucher(String id) {
        Voucher voucher = entityService.finVoucherById(id);

        if (!voucher.isActive()) {
            throw new RuntimeException("Voucher hiện không hoạt động");
        }
        if (voucher.getQuantity() <= 0) {
            throw new RuntimeException("Voucher đã hết lượt sử dụng");
        }

        voucher.setQuantity(voucher.getQuantity() - 1);
        voucherRepository.save(voucher);
    }

    /**
     * 8. HỆ THỐNG TỰ ĐỘNG KÍCH HOẠT VOUCHER
     */
    @Scheduled(cron = "1 0 0 * * *")
    @Transactional
    public void autoActivateVouchers() {
        LocalDate today = LocalDate.now();
        List<Voucher> vouchers = voucherRepository.findAll();

        for (Voucher voucher : vouchers) {
            // Nếu ngày bắt đầu là hôm nay và chưa active thì bật lên
            if (voucher.getStartDate().toLocalDate().isEqual(today) && !voucher.isActive()) {
                voucher.setActive(true);
                voucherRepository.save(voucher);
            }

            // Tự động tắt nếu đã hết hạn
            if (voucher.getEndDate().isBefore(LocalDateTime.now()) && voucher.isActive()) {
                voucher.setActive(false);
                voucherRepository.save(voucher);
            }
        }
    }
}
