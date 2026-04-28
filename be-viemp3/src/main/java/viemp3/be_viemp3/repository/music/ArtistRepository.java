package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Artist;

import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, String> {
    Optional<Artist> findByNameContainingIgnoreCase(String name);
}
