package viemp3.be_viemp3.dto.response.music;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.Data;

@Data
public class PlaylistResponse {
    private String id;
    private String name;
    private String cover;
    private OffsetDateTime createdAt;
    private String userId;
    private List<SongResponse> songs;
}
