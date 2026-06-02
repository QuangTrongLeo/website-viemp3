package viemp3.be_viemp3.mapper.finance;

import viemp3.be_viemp3.dto.response.finance.PackageResponse;
import viemp3.be_viemp3.entity.Packages;

import java.util.List;
import java.util.stream.Collectors;

public class PackageMapper {

    public static PackageResponse toResponse(Packages pkg) {
        if (pkg == null) {
            return null;
        }

        return PackageResponse.builder()
                .id(pkg.getId())
                .packageType(pkg.getPkg())
                .duration(pkg.getDuration())
                .basePrice(pkg.getBasePrice())
                .discountPercent(pkg.getDiscountPercent())
                .finalPrice(pkg.getFinalPrice())
                .createdAt(pkg.getCreatedAt())
                .build();
    }

    public static List<PackageResponse> toResponseList(List<Packages> packages) {
        if (packages == null) {
            return List.of();
        }

        return packages.stream()
                .map(PackageMapper::toResponse)
                .collect(Collectors.toList());
    }
}
