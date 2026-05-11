package viemp3.be_viemp3.dto.response.music;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteSongResponse {
    private String id;
    private OffsetDateTime favoritedAt;
    private SongResponse song;
}
