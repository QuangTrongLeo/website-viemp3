package viemp3.be_viemp3.repository.music;

import viemp3.be_viemp3.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlbumRepository extends JpaRepository<Album, String> {
    List<Album> findByArtistId(String artistId);

    @Modifying
    @Query("UPDATE Album a SET a.favorites = a.favorites + 1 WHERE a.id = :albumId")
    void incrementFavorites(@Param("albumId") String albumId);

    @Modifying
    @Query("""
        UPDATE Album a 
        SET a.favorites = 
            CASE WHEN a.favorites > 0 THEN a.favorites - 1 ELSE 0 END
        WHERE a.id = :albumId
    """)
    void decrementFavorites(@Param("albumId") String albumId);
}

