package viemp3.be_viemp3.service.music;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.entity.Album;
import viemp3.be_viemp3.entity.FavoriteAlbum;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.repository.music.AlbumRepository;
import viemp3.be_viemp3.repository.music.FavoriteAlbumRepository;
import viemp3.be_viemp3.service.auth.SecurityService;

@Service
@RequiredArgsConstructor
public class FavoriteAlbumService {
    private final AlbumRepository albumRepository;
    private final FavoriteAlbumRepository favoriteAlbumRepository;
    private final EntityQueryService entityQueryService;
    private final SecurityService securityService;

    // ===== ADD ALBUM TO FAVORITE =====
    @Transactional
    public void addAlbumToFavorite(String albumId) {
        User currentUser = securityService.getCurrentUser();
        Album album = entityQueryService.findAlbumById(albumId);
        boolean exists = favoriteAlbumRepository.existsByUserIdAndAlbumId(currentUser.getId(), albumId);
        if (exists) return;
        FavoriteAlbum favoriteAlbum = new FavoriteAlbum();
        favoriteAlbum.setUser(currentUser);
        favoriteAlbum.setAlbum(album);
        favoriteAlbumRepository.save(favoriteAlbum);
        albumRepository.incrementFavorites(albumId);
    }
}
