package viemp3.be_viemp3.controller.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.analytics.ListenStatisticsResponse;
import viemp3.be_viemp3.service.analytic.ListenStatisticsService;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("${api.vie-mp3-url}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final ListenStatisticsService listenStatisticsService;

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
}
