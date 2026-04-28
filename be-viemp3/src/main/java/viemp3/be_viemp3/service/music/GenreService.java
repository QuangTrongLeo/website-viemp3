package viemp3.be_viemp3.service.music;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.music.genre.GenreRequest;
import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.mapper.music.GenreMapper;
import viemp3.be_viemp3.repository.music.GenreRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenreRepository genreRepository;
    private final EntityQueryService entityService;

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

    // UPDATE GENRE
    public GenreResponse updateGenre(String id, GenreRequest request) {
        Genre genre = entityService.findGenreById(id);
        String newName = request.getName().trim().toUpperCase();
        if (!genre.getName().equalsIgnoreCase(newName) && genreRepository.existsByNameIgnoreCase(newName)) {
            throw new IllegalArgumentException("Genre đã tồn tại: " + newName);
        }
        genre.setName(newName);
        genreRepository.save(genre);
        return GenreMapper.toResponse(genre);
    }

    // GET ALL GENRES
    public List<GenreResponse> getAllGenres() {
        return GenreMapper.toResponseList(genreRepository.findAll());
    }

    // GET GENRE BY ID
    public GenreResponse getGenreById(String id) {
        return GenreMapper.toResponse(entityService.findGenreById(id));
    }
}
