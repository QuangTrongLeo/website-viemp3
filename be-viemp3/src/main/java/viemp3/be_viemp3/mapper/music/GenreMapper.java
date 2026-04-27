package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.entity.Genre;

public class GenreMapper {
    public static GenreResponse toResponse(Genre genre) {
        GenreResponse response = new GenreResponse();
        response.setId(genre.getId());
        response.setName(genre.getName());
        return response;
    }
}
