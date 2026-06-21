package viemp3.be_viemp3.dto.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueStatisticsResponse {
    private Double totalRevenue;
    private long totalCompletedOrders;
}
