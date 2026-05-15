package viemp3.be_viemp3.dto.response.music;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteAlbumResponse {
    private String id;
    private OffsetDateTime favoritedAt;
    private AlbumResponse album;
}
