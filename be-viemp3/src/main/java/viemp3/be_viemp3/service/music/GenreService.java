package viemp3.be_viemp3.service.music;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.dto.request.music.genre.GenreRequest;
import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.mapper.music.GenreMapper;
import viemp3.be_viemp3.repository.music.GenreRepository;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;

    // CREATE GENRE
    public GenreResponse createGenre(GenreRequest request) {
        String name = request.getName().trim().toUpperCase();
        if (genreRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Genre đã tồn tại: " + name);
        }
        Genre genre = new Genre();
        genre.setName(name);
        genreRepository.save(genre);
        return GenreMapper.toResponse(genre);
    }
}
