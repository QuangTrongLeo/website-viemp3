package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.AlbumResponse;
import viemp3.be_viemp3.entity.Album;

public class AlbumMapper {

    public static AlbumResponse toResponse(Album album) {
        if (album == null) {
            return null;
        }

        return AlbumResponse.builder()
                .id(album.getId())
                .title(album.getTitle())
                .cover(album.getCover())
                .artistId(album.getArtist() != null ? album.getArtist().getId() : null)
                .favorites(album.getFavorites())
                .createdAt(album.getCreatedAt())
                .build();
    }
    
}
