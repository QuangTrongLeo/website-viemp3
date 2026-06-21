package viemp3.be_viemp3.service.analytic;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.dto.response.analytics.ListenStatisticsResponse;
import viemp3.be_viemp3.mapper.analytics.ListenStatisticsMapper;
import viemp3.be_viemp3.repository.music.ListenHistoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListenStatisticsService {
    private final ListenHistoryRepository listenHistoryRepository;
    private final ListenStatisticsMapper listenStatisticsMapper;

    // Thống kê theo ngày
    public List<ListenStatisticsResponse> getListenByDay() {
        List<Object[]> results = listenHistoryRepository.getListenStatsByDayNative();
        return listenStatisticsMapper.toResponseList(results);
    }

    // Thống kê theo tuần
    public List<ListenStatisticsResponse> getListenByWeek() {
        List<Object[]> results = listenHistoryRepository.getListenStatsByWeekNative();
        return listenStatisticsMapper.toResponseList(results);
    }
}
