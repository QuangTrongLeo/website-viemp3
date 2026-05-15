package viemp3.be_viemp3.mapper.music;

import java.util.List;

import viemp3.be_viemp3.dto.response.music.FavoriteAlbumResponse;
import viemp3.be_viemp3.entity.FavoriteAlbum;

public class FavoriteAlbumMapper {

    public static FavoriteAlbumResponse toResponse(FavoriteAlbum favoriteAlbum) {
        return FavoriteAlbumResponse.builder()
                .id(favoriteAlbum.getId())
                .favoritedAt(favoriteAlbum.getFavoritedAt())
                .album(AlbumMapper.toResponse(favoriteAlbum.getAlbum()))
                .build();
    }

    public static List<FavoriteAlbumResponse> toResponseList(List<FavoriteAlbum> list) {
        return list.stream()
                .map(FavoriteAlbumMapper::toResponse)
                .toList();
    }
}

