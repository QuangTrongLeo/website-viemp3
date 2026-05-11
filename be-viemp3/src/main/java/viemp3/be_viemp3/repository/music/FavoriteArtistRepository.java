package viemp3.be_viemp3.repository.music;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.FavoriteArtist;

@Repository
public interface FavoriteArtistRepository extends JpaRepository<FavoriteArtist, String> {
    boolean existsByUserIdAndArtistId(String userId, String artistId);
    List<FavoriteArtist> findByArtistId(String artistId);
}
