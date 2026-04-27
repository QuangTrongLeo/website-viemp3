package viemp3.be_viemp3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.repository.music.GenreRepository;

@Service
@RequiredArgsConstructor
public class EntityQueryService {
    private final GenreRepository genreRepository;

    // ===== GENRE =====
    public Genre findGenreById(String id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genre không tồn tại với id: " + id));
    }
}
