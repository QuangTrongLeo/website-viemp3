package viemp3.be_viemp3.dto.response.finance;

import lombok.*;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@Builder
public class VoucherResponse {
    private String id;
    private Integer quantity;
    private Double discountPercentage;
    private Double maxDiscountAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private OffsetDateTime createdAt;
    private Boolean active;
}
