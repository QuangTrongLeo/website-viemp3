package viemp3.be_viemp3.dto.response.music;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class SongResponse {
    private String id;
    private String title;
    private String cover;
    private String audio;
    private String description;
    private String artistId;
    private String albumId;
    private String genreId;
    private int favorites;
    private long listenCount;
    private OffsetDateTime createdAt;
}
