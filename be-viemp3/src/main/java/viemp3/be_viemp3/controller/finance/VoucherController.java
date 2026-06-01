package viemp3.be_viemp3.controller.finance;

import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.finance.VoucherRequest;
import viemp3.be_viemp3.dto.response.finance.VoucherResponse;
import viemp3.be_viemp3.service.finance.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(@RequestBody VoucherRequest request) {
        VoucherResponse response = voucherService.createVoucher(request);
        return ResponseEntity.ok(
                ApiResponse.<VoucherResponse>builder()
                        .success(true)
                        .message("Tạo voucher mới thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PutMapping("/{voucherId}")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(
            @PathVariable String voucherId,
            @RequestBody VoucherRequest request) {
        VoucherResponse response = voucherService.updateVoucher(voucherId, request);
        return ResponseEntity.ok(
                ApiResponse.<VoucherResponse>builder()
                        .success(true)
                        .message("Cập nhật voucher thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @DeleteMapping("/{voucherId}")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable String voucherId) {
        voucherService.deleteVoucher(voucherId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xóa voucher thành công")
                        .build()
        );
    }

    // ===== GET BY ID =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD', 'USER')")
    @GetMapping("/{voucherId}")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(@PathVariable String voucherId) {
        VoucherResponse response = voucherService.getVoucherById(voucherId);
        return ResponseEntity.ok(
                ApiResponse.<VoucherResponse>builder()
                        .success(true)
                        .message("Lấy thông tin voucher thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== GET ALL (Dành cho Admin quản lý) =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAllVouchers() {
        List<VoucherResponse> responses = voucherService.getAllVouchers();
        return ResponseEntity.ok(
                ApiResponse.<List<VoucherResponse>>builder()
                        .success(true)
                        .message("Lấy toàn bộ danh sách voucher thành công")
                        .data(responses)
                        .build()
        );
    }

    // ===== GET AVAILABLE (Dành cho người dùng chọn khi thanh toán) =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD', 'USER')")
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<VoucherResponse>>> getAvailableVouchers() {
        List<VoucherResponse> responses = voucherService.getAvailableVouchers();
        return ResponseEntity.ok(
                ApiResponse.<List<VoucherResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách voucher khả dụng thành công")
                        .data(responses)
                        .build()
        );
    }
}
