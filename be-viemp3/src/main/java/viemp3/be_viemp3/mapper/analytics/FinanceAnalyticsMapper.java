package viemp3.be_viemp3.mapper.analytics;

import viemp3.be_viemp3.dto.response.analytics.MonthlyRevenueResponse;
import viemp3.be_viemp3.dto.response.analytics.PackageDistributionResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public static List<MonthlyRevenueResponse> toMonthlyRevenueList(List<Object[]> results) {
        // Khởi tạo map với 12 tháng mặc định doanh thu bằng 0
        Map<Integer, Double> revenueMap = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            revenueMap.put(i, 0.0);
        }

        // Đổ dữ liệu từ query vào map
        for (Object[] result : results) {
            Integer month = ((Number) result[0]).intValue();
            Double revenue = ((Number) result[1]).doubleValue();
            revenueMap.put(month, revenue);
        }

        // Chuyển map sang List Response
        List<MonthlyRevenueResponse> responses = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            responses.add(new MonthlyRevenueResponse("Th" + i, revenueMap.get(i)));
        }
        return responses;
    }
}
