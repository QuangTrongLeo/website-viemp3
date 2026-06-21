package viemp3.be_viemp3.dto.response.analytics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatisticsResponse {
    private String label;
    private Long count;
    private Double percentage;
}
