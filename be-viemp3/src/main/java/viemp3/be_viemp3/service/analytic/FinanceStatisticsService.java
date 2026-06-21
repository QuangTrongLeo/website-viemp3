package viemp3.be_viemp3.service.analytic;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.dto.response.analytics.RevenueStatisticsResponse;
import viemp3.be_viemp3.enums.OrderStatus;
import viemp3.be_viemp3.repository.finance.OrderRepository;

@Service
@RequiredArgsConstructor
public class FinanceStatisticsService {
    private final OrderRepository orderRepository;

    // 1. Thống kê doanh thu
    public RevenueStatisticsResponse getRevenueStatistics() {
        Double totalRevenue = orderRepository.sumTotalRevenueByCompletedStatus();
        long totalOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);
        return new RevenueStatisticsResponse(totalRevenue != null ? totalRevenue : 0.0, totalOrders);
    }
}
