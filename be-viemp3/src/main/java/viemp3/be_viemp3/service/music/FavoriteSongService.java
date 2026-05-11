package viemp3.be_viemp3.service.music;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.response.music.FavoriteSongResponse;
import viemp3.be_viemp3.entity.FavoriteSong;
import viemp3.be_viemp3.entity.Song;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.mapper.music.FavoriteSongMapper;
import viemp3.be_viemp3.repository.music.FavoriteSongRepository;
import viemp3.be_viemp3.repository.music.SongRepository;
import viemp3.be_viemp3.service.auth.SecurityService;

import java.util.List;

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

    // ===== REMOVE SONG FROM FAVORITE =====
    @Transactional
    public void removeSongFromFavorite(String songId) {
        User currentUser = securityService.getCurrentUser();
        FavoriteSong favoriteSong = entityService.findFavoriteSong(currentUser.getId(), songId);
        favoriteSongRepository.delete(favoriteSong);
        songRepository.decrementFavorites(songId);
    }

    // ===== GET MY FAVORITE SONGS =====
    public List<FavoriteSongResponse> getMyFavoriteSongs() {
        User currentUser = securityService.getCurrentUser();
        List<FavoriteSong> favoriteSongs = favoriteSongRepository.findByUserId(currentUser.getId());
        return FavoriteSongMapper.toResponseList(favoriteSongs);
    }
}
