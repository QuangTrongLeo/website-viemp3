package viemp3.be_viemp3.repository.music;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import viemp3.be_viemp3.entity.FavoriteAlbum;

public interface FavoriteAlbumRepository extends JpaRepository<FavoriteAlbum, String> {
    boolean existsByUserIdAndAlbumId(String userId, String albumId);
    Optional<FavoriteAlbum> findByUserIdAndAlbumId(String userId, String albumId);
    List<FavoriteAlbum> findByUserId(String userId);
}
