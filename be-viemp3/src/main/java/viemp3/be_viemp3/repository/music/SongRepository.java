package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Song;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {
    List<Song> findByGenreId(String genreId);
}
