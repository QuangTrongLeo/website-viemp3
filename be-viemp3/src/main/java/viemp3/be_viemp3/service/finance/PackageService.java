package viemp3.be_viemp3.service.finance;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    private Double calculateFinalPrice(Double basePrice, int months, Double discountPercent) {
        double totalBeforeDiscount = basePrice * months;
        return totalBeforeDiscount * (1 - (discountPercent / 100));
    }
}
