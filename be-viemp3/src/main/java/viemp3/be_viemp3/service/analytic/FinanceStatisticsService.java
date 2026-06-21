package viemp3.be_viemp3.service.analytic;

import viemp3.be_viemp3.dto.response.analytics.MonthlyRevenueResponse;
import viemp3.be_viemp3.dto.response.analytics.PackageDistributionResponse;
import viemp3.be_viemp3.dto.response.analytics.RevenueStatisticsResponse;
import viemp3.be_viemp3.enums.OrderStatus;
import viemp3.be_viemp3.mapper.analytics.FinanceAnalyticsMapper;
import viemp3.be_viemp3.repository.finance.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceStatisticsService {
    private final OrderRepository orderRepository;

    // 1. Thống kê doanh thu (Trường hợp đơn giản không cần mapper phức tạp)
    public RevenueStatisticsResponse getRevenueStatistics() {
        Double totalRevenue = orderRepository.sumTotalRevenueByCompletedStatus();
        long totalOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        return new RevenueStatisticsResponse(totalRevenue != null ? totalRevenue : 0.0, totalOrders);
    }

    // 2. Thống kê phân bổ gói cước (Sử dụng Mapper để xử lý logic % và tên gói)
    public List<PackageDistributionResponse> getPackageDistribution() {
        long totalCompleted = orderRepository.countByStatus(OrderStatus.COMPLETED);
        List<Object[]> results = orderRepository.countOrdersByPackageGrouped();
        return FinanceAnalyticsMapper.toPackageDistributionList(results, totalCompleted);
    }

    // 3. Thống kê doanh thu 12 tháng trong năm
    public List<MonthlyRevenueResponse> getMonthlyRevenueStatistics() {
        List<Object[]> results = orderRepository.getMonthlyRevenueStats();
        return FinanceAnalyticsMapper.toMonthlyRevenueList(results);
    }
}

