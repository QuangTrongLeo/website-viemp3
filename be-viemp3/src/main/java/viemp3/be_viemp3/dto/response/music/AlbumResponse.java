package viemp3.be_viemp3.dto.response.music;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class AlbumResponse {
    private String id;
    private String title;
    private String cover;
    private String artistId;
    private int favorites;
    private OffsetDateTime createdAt;
}
