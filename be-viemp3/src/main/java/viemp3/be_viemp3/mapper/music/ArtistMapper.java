package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.ArtistResponse;
import viemp3.be_viemp3.entity.Artist;

import java.util.List;
import java.util.stream.Collectors;

public class ArtistMapper {

    public static ArtistResponse toResponse(Artist artist) {
        if (artist == null) return null;
        ArtistResponse response = new ArtistResponse();
        response.setId(artist.getId());
        response.setName(artist.getName());
        response.setAvatar(artist.getAvatar());
        response.setFavorites(artist.getFavorites());
        response.setCreatedAt(artist.getCreatedAt());
        return response;
    }

    public static List<ArtistResponse> toResponseList(List<Artist> artists) {
        if (artists == null) return List.of();
        return artists.stream()
                .map(ArtistMapper::toResponse)
                .collect(Collectors.toList());
    }
}
