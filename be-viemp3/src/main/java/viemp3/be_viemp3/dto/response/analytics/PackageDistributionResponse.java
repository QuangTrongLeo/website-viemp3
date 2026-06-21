package viemp3.be_viemp3.dto.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PackageDistributionResponse {
    private String packageName;
    private long count;
    private double percentage;
}