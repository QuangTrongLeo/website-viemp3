package viemp3.be_viemp3.mapper.analytics;

import viemp3.be_viemp3.dto.response.analytics.PackageDistributionResponse;

import java.util.List;
import java.util.stream.Collectors;

public class FinanceAnalyticsMapper {
    public static PackageDistributionResponse toPackageDistributionResponse(Object[] result, long totalCompleted) {
        if (result == null) return null;
        String packageName = result[0].toString() + " (" + result[1].toString() + ")";
        long count = ((Number) result[2]).longValue();
        double percentage = (totalCompleted > 0) ? ((double) count / totalCompleted) * 100 : 0;
        percentage = Math.round(percentage * 100.0) / 100.0;
        return new PackageDistributionResponse(packageName, count, percentage);
    }

    public static List<PackageDistributionResponse> toPackageDistributionList(List<Object[]> results, long totalCompleted) {
        return results.stream()
                .map(res -> toPackageDistributionResponse(res, totalCompleted))
                .collect(Collectors.toList());
    }
}
