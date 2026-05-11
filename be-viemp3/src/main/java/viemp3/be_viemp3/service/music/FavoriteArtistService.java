package viemp3.be_viemp3.service.music;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.entity.FavoriteArtist;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.repository.music.ArtistRepository;
import viemp3.be_viemp3.repository.music.FavoriteArtistRepository;
import viemp3.be_viemp3.service.auth.SecurityService;

@Service
@RequiredArgsConstructor
public class FavoriteArtistService {
    private final ArtistRepository artistRepository;
    private final FavoriteArtistRepository favoriteArtistRepository;
    private final EntityQueryService entityService;
    private final SecurityService securityService;

    // ===== ADD ARTIST TO FAVORITE =====
    @Transactional
    public void addArtistToFavorite(String artistId) {
        User currentUser = securityService.getCurrentUser();
        Artist artist = entityService.findArtistById(artistId);
        boolean exists = favoriteArtistRepository.existsByUserIdAndArtistId(currentUser.getId(), artistId);
        if (exists) return;
        FavoriteArtist favoriteArtist = new FavoriteArtist();
        favoriteArtist.setUser(currentUser);
        favoriteArtist.setArtist(artist);
        favoriteArtistRepository.save(favoriteArtist);
        artistRepository.incrementFavorites(artistId);
    }

    // ===== REMOVE ARTIST FROM FAVORITE =====
    @Transactional
    public void removeArtistFromFavorite(String artistId) {
        User currentUser = securityService.getCurrentUser();
        FavoriteArtist favoriteArtist = entityService.findFavoriteArtist(currentUser.getId(), artistId);
        favoriteArtistRepository.delete(favoriteArtist);
        artistRepository.decrementFavorites(artistId);
    }
}
