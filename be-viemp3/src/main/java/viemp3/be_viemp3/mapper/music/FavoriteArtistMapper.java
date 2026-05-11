package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.FavoriteArtistResponse;
import viemp3.be_viemp3.entity.FavoriteArtist;

import java.util.List;

public class FavoriteArtistMapper {

    public static FavoriteArtistResponse toResponse(FavoriteArtist favoriteArtist) {
        if (favoriteArtist == null) return null;
        return FavoriteArtistResponse.builder()
                .id(favoriteArtist.getId())
                .favoritedAt(favoriteArtist.getFavoritedAt())
                .artist(ArtistMapper.toResponse(favoriteArtist.getArtist()))
                .build();
    }

    public static List<FavoriteArtistResponse> toResponseList(List<FavoriteArtist> list) {
        if (list == null) return List.of();
        return list.stream()
                .map(FavoriteArtistMapper::toResponse)
                .toList();
    }
}
