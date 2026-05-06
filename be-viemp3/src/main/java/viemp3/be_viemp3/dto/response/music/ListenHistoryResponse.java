package viemp3.be_viemp3.dto.response.music;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class ListenHistoryResponse {
    private String id;
    private OffsetDateTime listenedAt;
    private SongResponse song;
}