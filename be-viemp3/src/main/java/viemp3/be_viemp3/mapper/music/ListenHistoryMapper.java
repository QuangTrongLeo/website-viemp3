package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.ListenHistoryResponse;
import viemp3.be_viemp3.entity.ListenHistory;

import java.util.List;

public class ListenHistoryMapper {
    public static ListenHistoryResponse toResponse(ListenHistory history) {
        return ListenHistoryResponse.builder()
                .id(history.getId())
                .listenedAt(history.getListenedAt())
                .song(SongMapper.toResponse(history.getSong()))
                .build();
    }

    public static List<ListenHistoryResponse> toResponseList(List<ListenHistory> histories) {
        return histories.stream()
                .map(ListenHistoryMapper::toResponse)
                .toList();
    }
}
