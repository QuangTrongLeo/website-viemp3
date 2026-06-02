package viemp3.be_viemp3.dto.request.finance;

import lombok.Data;
import viemp3.be_viemp3.enums.DurationType;
import viemp3.be_viemp3.enums.PackageType;

@Data
public class PackageRequest {
    private PackageType type;
    private DurationType duration;
    private Double basePrice;
    private Double discountPercent;
}