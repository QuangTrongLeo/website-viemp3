package viemp3.be_viemp3.dto.request.finance;

import lombok.Data;

@Data
public class OrderRequest {
    private String packageId;
    private String voucherId;
    private Double totalPrice;
}
