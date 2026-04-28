package viemp3.be_viemp3.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.repository.auth.RoleRepository;
import viemp3.be_viemp3.repository.auth.UserRepository;
import viemp3.be_viemp3.repository.music.ArtistRepository;
import viemp3.be_viemp3.repository.music.GenreRepository;

@Service
@RequiredArgsConstructor
public class EntityQueryService {
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // ===== ARTIST =====
    public Artist findArtistById(String id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nghệ sĩ không tồn tại với id: " + id));
    }

    public Artist findArtistByName(String artistName) {
        return artistRepository.findByNameContainingIgnoreCase(artistName)
                .orElseThrow(() -> new IllegalArgumentException("Nghệ sĩ không tồn tại"));
    }

    // ===== GENRE =====
    public Genre findGenreById(String id) {
        return genreRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Genre không tồn tại với id: " + id));
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
