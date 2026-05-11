package viemp3.be_viemp3.repository.music;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Song;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {
    List<Song> findByArtistId(String artistId);
    List<Song> findByAlbumId(String albumId);
    List<Song> findByGenreId(String genreId);

    @Modifying
    @Transactional
    @Query("UPDATE Song s SET s.listenCount = s.listenCount + 1 WHERE s.id = :songId")
    void incrementListenCount(@Param("songId") String songId);

    @Modifying
    @Transactional
    @Query("UPDATE Song s SET s.favorites = s.favorites + 1 WHERE s.id = :songId")
    void incrementFavorites(@Param("songId") String songId);

    @Modifying
    @Transactional
    @Query("""
        UPDATE Song s
        SET s.favorites =
            CASE WHEN s.favorites > 0 THEN s.favorites - 1 ELSE 0 END
        WHERE s.id = :songId
    """)
    void decrementFavorites(@Param("songId") String songId);
}
