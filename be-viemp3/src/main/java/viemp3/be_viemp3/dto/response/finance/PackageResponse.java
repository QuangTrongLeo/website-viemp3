package viemp3.be_viemp3.dto.response.finance;

import lombok.Builder;
import lombok.Data;
import viemp3.be_viemp3.enums.DurationType;
import viemp3.be_viemp3.enums.PackageType;

import java.time.LocalDateTime;

@Data
@Builder
public class PackageResponse {
    private String id;
    private PackageType packageType;
    private DurationType duration;
    private Double basePrice;
    private Double discountPercent;
    private Double finalPrice;
    private LocalDateTime createdAt;
}
