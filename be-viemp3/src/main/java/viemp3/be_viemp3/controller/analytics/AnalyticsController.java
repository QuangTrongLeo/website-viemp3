package viemp3.be_viemp3.controller.analytics;

import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.analytics.*;
import viemp3.be_viemp3.service.analytic.FinanceStatisticsService;
import viemp3.be_viemp3.service.analytic.GenreStatisticsService;
import viemp3.be_viemp3.service.analytic.ListenStatisticsService;
import viemp3.be_viemp3.service.analytic.UserStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("${api.vie-mp3-url}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final UserStatisticsService userStatisticsService;
    private final ListenStatisticsService listenStatisticsService;
    private final GenreStatisticsService genreStatisticsService;
    private final FinanceStatisticsService financeStatisticsService;

    // ===== USER STATS =====
    @GetMapping("/users/status")
    public ApiResponse<List<UserStatisticsResponse>> getUserStatusStats() {
        return ApiResponse.<List<UserStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê trạng thái tài khoản thành công")
                .data(userStatisticsService.getStatusStatistics())
                .build();
    }

    @GetMapping("/users/roles")
    public ApiResponse<List<UserStatisticsResponse>> getUserRoleStats() {
        return ApiResponse.<List<UserStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê vai trò hệ thống thành công")
                .data(userStatisticsService.getSystemRoleStatistics())
                .build();
    }

    @GetMapping("/users/memberships")
    public ApiResponse<List<UserStatisticsResponse>> getUserMembershipStats() {
        return ApiResponse.<List<UserStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê phân bổ hội viên thành công")
                .data(userStatisticsService.getMembershipStatistics())
                .build();
    }

    // ===== LISTEN =====
    @GetMapping("/listen/day")
    public ApiResponse<List<ListenStatisticsResponse>> getListenByDay() {
        return ApiResponse.<List<ListenStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê lượt nghe theo ngày thành công")
                .data(listenStatisticsService.getListenByDay())
                .build();
    }

    @GetMapping("/listen/week")
    public ApiResponse<List<ListenStatisticsResponse>> getListenByWeek() {
        return ApiResponse.<List<ListenStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê lượt nghe theo tuần thành công")
                .data(listenStatisticsService.getListenByWeek())
                .build();
    }

    @GetMapping("/listen/month")
    public ApiResponse<List<ListenStatisticsResponse>> getListenByMonth() {
        return ApiResponse.<List<ListenStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê lượt nghe theo tháng thành công")
                .data(listenStatisticsService.getListenByMonth())
                .build();
    }

    // ===== GENRE =====
    @GetMapping("/genres")
    public ApiResponse<List<GenreStatisticsResponse>> getGenreStatistics() {
        return ApiResponse.<List<GenreStatisticsResponse>>builder()
                .success(true)
                .message("Lấy thống kê tỷ trọng thể loại thành công")
                .data(genreStatisticsService.getGenreStatistics())
                .build();
    }

    // ===== FINANCE STATS =====
    @GetMapping("/finance/revenue")
    public ApiResponse<RevenueStatisticsResponse> getRevenueStatistics() {
        return ApiResponse.<RevenueStatisticsResponse>builder()
                .success(true)
                .message("Lấy thống kê doanh thu thành công")
                .data(financeStatisticsService.getRevenueStatistics())
                .build();
    }

    @GetMapping("/finance/packages")
    public ApiResponse<List<PackageDistributionResponse>> getPackageDistribution() {
        return ApiResponse.<List<PackageDistributionResponse>>builder()
                .success(true)
                .message("Lấy thống kê phân bổ gói cước thành công")
                .data(financeStatisticsService.getPackageDistribution())
                .build();
    }

    @GetMapping("/finance/revenue/monthly")
    public ApiResponse<List<MonthlyRevenueResponse>> getMonthlyRevenue() {
        return ApiResponse.<List<MonthlyRevenueResponse>>builder()
                .success(true)
                .message("Lấy thống kê doanh thu theo tháng thành công")
                .data(financeStatisticsService.getMonthlyRevenueStatistics())
                .build();
    }
}