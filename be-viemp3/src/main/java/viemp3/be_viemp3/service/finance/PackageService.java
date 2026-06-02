package viemp3.be_viemp3.service.finance;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.finance.PackageRequest;
import viemp3.be_viemp3.dto.response.finance.PackageResponse;
import viemp3.be_viemp3.entity.Packages;
import viemp3.be_viemp3.mapper.finance.PackageMapper;
import viemp3.be_viemp3.repository.finance.PackageRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PackageService {
    private final PackageRepository packageRepository;
    private final EntityQueryService entityService;

    @Transactional
    public PackageResponse createPackage(PackageRequest request) {
        Double discount = (request.getDiscountPercent() != null) ? request.getDiscountPercent() : 0.0;

        Packages pkg = new Packages();
        pkg.setPkg(request.getType());
        pkg.setDuration(request.getDuration());
        pkg.setBasePrice(request.getBasePrice());
        pkg.setDiscountPercent(discount);
        pkg.setCreatedAt(LocalDateTime.now());
        pkg.setFinalPrice(calculateFinalPrice(
                request.getBasePrice(),
                request.getDuration().getMonths(),
                request.getDiscountPercent()
        ));

        return PackageMapper.toResponse(packageRepository.save(pkg));
    }

    @Transactional
    public PackageResponse updatePackage(String id, PackageRequest request) {
        Packages pkg = entityService.findPackageById(id);

        if (request.getType() != null) pkg.setPkg(request.getType());
        if (request.getDuration() != null) pkg.setDuration(request.getDuration());
        if (request.getBasePrice() != null) pkg.setBasePrice(request.getBasePrice());
        if (request.getDiscountPercent() != null) pkg.setDiscountPercent(request.getDiscountPercent());

        // Sau khi update các trường, tính toán lại finalPrice
        pkg.setFinalPrice(calculateFinalPrice(
                pkg.getBasePrice(),
                pkg.getDuration().getMonths(),
                pkg.getDiscountPercent()
        ));

        return PackageMapper.toResponse(packageRepository.save(pkg));
    }

    private Double calculateFinalPrice(Double basePrice, int months, Double discountPercent) {
        double totalBeforeDiscount = basePrice * months;
        return totalBeforeDiscount * (1 - (discountPercent / 100));
    }
}
