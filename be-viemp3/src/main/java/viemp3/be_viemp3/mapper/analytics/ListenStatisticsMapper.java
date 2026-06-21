package viemp3.be_viemp3.mapper.analytics;


import org.springframework.stereotype.Component;
import viemp3.be_viemp3.dto.response.analytics.ListenStatisticsResponse;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ListenStatisticsMapper {

    public ListenStatisticsResponse toResponse(Object[] obj) {
        if (obj == null || obj.length < 2) return null;
        return new ListenStatisticsResponse(
                (String) obj[0],
                ((Number) obj[1]).longValue()
        );
    }

    public List<ListenStatisticsResponse> toResponseList(List<Object[]> list) {
        return list.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
