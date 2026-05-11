package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Artist;

import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, String> {
    Optional<Artist> findByNameContainingIgnoreCase(String name);

    @Modifying
    @Query("UPDATE Artist a SET a.favorites = a.favorites + 1 WHERE a.id = :artistId")
    void incrementFavorites(@Param("artistId") String artistId);

    @Modifying
    @Query("UPDATE Artist a SET a.favorites = CASE WHEN a.favorites > 0 THEN a.favorites - 1 ELSE 0 END WHERE a.id = :artistId")
    void decrementFavorites(@Param("artistId") String artistId);
}
