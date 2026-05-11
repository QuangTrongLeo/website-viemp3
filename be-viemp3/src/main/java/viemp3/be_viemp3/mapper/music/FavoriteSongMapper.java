package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.FavoriteSongResponse;
import viemp3.be_viemp3.entity.FavoriteSong;

import java.util.List;

public class FavoriteSongMapper {

    public static FavoriteSongResponse toResponse(FavoriteSong favoriteSong) {
        return FavoriteSongResponse.builder()
                .id(favoriteSong.getId())
                .favoritedAt(favoriteSong.getFavoritedAt())
                .song(SongMapper.toResponse(favoriteSong.getSong()))
                .build();
    }

    public static List<FavoriteSongResponse> toResponseList(List<FavoriteSong> list) {
        return list.stream()
                .map(FavoriteSongMapper::toResponse)
                .toList();
    }
}
