package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.entity.Genre;

import java.util.List;
import java.util.stream.Collectors;

public class GenreMapper {
    public static GenreResponse toResponse(Genre genre) {
        GenreResponse response = new GenreResponse();
        response.setId(genre.getId());
        response.setName(genre.getName());
        return response;
    }

    public static List<GenreResponse> toResponseList(List<Genre> genres) {
        if (genres == null) return null;
        return genres.stream()
                .map(GenreMapper::toResponse)
                .collect(Collectors.toList());
    }
}
