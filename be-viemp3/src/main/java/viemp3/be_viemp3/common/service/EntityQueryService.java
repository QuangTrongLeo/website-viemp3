package viemp3.be_viemp3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.entity.*;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.repository.auth.RoleRepository;
import viemp3.be_viemp3.repository.auth.UserRepository;
import viemp3.be_viemp3.repository.music.*;

@Service
@RequiredArgsConstructor
public class EntityQueryService {
    private final ArtistRepository artistRepository;
    private final AlbumRepository albumRepository;
    private final FavoriteArtistRepository favoriteArtistRepository;
    private final FavoriteSongRepository favoriteSongRepository;
    private final GenreRepository genreRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // ===== ALBUM =====
    public Album findAlbumById(String id) {
        return albumRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Album không tồn tại"));
    }

    // ===== ARTIST =====
    public Artist findArtistById(String id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nghệ sĩ không tồn tại với id: " + id));
    }

    public Artist findArtistByName(String artistName) {
        return artistRepository.findByNameContainingIgnoreCase(artistName)
                .orElseThrow(() -> new IllegalArgumentException("Nghệ sĩ không tồn tại"));
    }

    public FavoriteArtist findFavoriteArtist(String userId, String artistId) {
        return favoriteArtistRepository
                .findByUserIdAndArtistId(userId, artistId)
                .orElseThrow(() ->
                        new IllegalStateException("Artist không tồn tại trong danh sách yêu thích")
                );
    }

    // ===== GENRE =====
    public Genre findGenreById(String id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genre không tồn tại với id: " + id));
    }

    // ===== SONG =====
    public Song findSongById(String id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bài hát không tồn tại với id: " + id));
    }

    public FavoriteSong findFavoriteSong(String userId, String songId) {
        return favoriteSongRepository
                .findByUserIdAndSongId(userId, songId)
                .orElseThrow(() ->
                        new IllegalStateException("Bài hát không tồn tại trong danh sách yêu thích")
                );
    }

    // ===== USER =====
    public User findUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User không tồn tại với id: " + id));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }

    // ===== ROLE =====
    public Role findRoleByName(RoleEnum role) {
        return roleRepository.findByName(role)
                .orElseThrow(() -> new RuntimeException("Role không tồn tại!"));
    }
    
}
