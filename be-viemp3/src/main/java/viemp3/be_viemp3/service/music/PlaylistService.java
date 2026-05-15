package viemp3.be_viemp3.service.music;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.music.playlist.PlaylistRequest;
import viemp3.be_viemp3.dto.response.music.PlaylistResponse;
import viemp3.be_viemp3.entity.Playlist;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.mapper.music.PlaylistMapper;
import viemp3.be_viemp3.repository.music.PlaylistRepository;
import viemp3.be_viemp3.service.auth.SecurityService;
import viemp3.be_viemp3.service.file.FileStorageService;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final EntityQueryService entityQueryService;
    private final FileStorageService fileStorageService;
    private final SecurityService securityService;

    // ===== CREATE =====
    public PlaylistResponse createPlaylist(PlaylistRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Tên playlist là bắt buộc");
        }
        User user = securityService.getCurrentUser();
        String coverUrl = null;
        if (request.getCover() != null && !request.getCover().isEmpty()) {
            coverUrl = fileStorageService.upload(request.getCover(), "playlists");
        }
        Playlist playlist = new Playlist();
        playlist.setName(request.getName().trim());
        playlist.setCover(coverUrl);
        playlist.setUser(user);
        playlist.setSongs(new ArrayList<>());
        playlist = playlistRepository.save(playlist);
        return PlaylistMapper.toResponse(playlist);
    }
}
