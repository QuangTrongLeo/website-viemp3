package viemp3.be_viemp3.service.music;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.entity.FavoriteSong;
import viemp3.be_viemp3.entity.Song;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.repository.music.FavoriteSongRepository;
import viemp3.be_viemp3.repository.music.SongRepository;
import viemp3.be_viemp3.service.auth.SecurityService;

@Service
@RequiredArgsConstructor
public class FavoriteSongService {
    private final SongRepository songRepository;
    private final FavoriteSongRepository favoriteSongRepository;
    private final EntityQueryService entityService;
    private final SecurityService securityService;

    // ===== ADD SONG TO FAVORITE =====
    @Transactional
    public void addSongToFavorite(String songId) {
        User currentUser = securityService.getCurrentUser();
        Song song = entityService.findSongById(songId);
        boolean exists = favoriteSongRepository.existsByUserIdAndSongId(currentUser.getId(), songId);
        if (exists) {
            return;
        }
        FavoriteSong favoriteSong = new FavoriteSong();
        favoriteSong.setUser(currentUser);
        favoriteSong.setSong(song);
        favoriteSongRepository.save(favoriteSong);
        songRepository.incrementFavorites(songId);
    }
}
