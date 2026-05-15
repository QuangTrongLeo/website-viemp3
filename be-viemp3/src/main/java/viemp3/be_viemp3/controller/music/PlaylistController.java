package viemp3.be_viemp3.controller.music;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.music.playlist.PlaylistRequest;
import viemp3.be_viemp3.dto.request.music.playlist.SongToPlaylistRequest;
import viemp3.be_viemp3.dto.response.music.PlaylistResponse;
import viemp3.be_viemp3.service.music.PlaylistService;

@RestController
@RequestMapping("${api.vie-mp3-url}/playlists")
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;

    // ===== CREATE =====
    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PlaylistResponse>> createPlaylist(@ModelAttribute PlaylistRequest request) {
        PlaylistResponse response = playlistService.createPlaylist(request);
        return ResponseEntity.ok(
                ApiResponse.<PlaylistResponse>builder()
                        .success(true)
                        .message("Tạo playlist thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE =====
    @PreAuthorize("hasRole('USER')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PlaylistResponse>> updatePlaylist(
            @PathVariable String id,
            @ModelAttribute PlaylistRequest request) {
        return ResponseEntity.ok(
                ApiResponse.<PlaylistResponse>builder()
                        .success(true)
                        .message("Cập nhật playlist thành công")
                        .data(playlistService.updatePlaylist(id, request))
                        .build()
        );
    }

    // ===== DELETE =====
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{playlistId}")
    public ResponseEntity<ApiResponse<Void>> deletePlaylist(@PathVariable String playlistId) {
        playlistService.deletePlaylist(playlistId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xoá playlist thành công")
                        .build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/add-song")
    public ResponseEntity<ApiResponse<Void>> addSongToPlaylist(@RequestBody SongToPlaylistRequest request) {
        playlistService.addSongToPlaylist(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Thêm bài hát vào playlist thành công")
                        .build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/remove-song")
    public ResponseEntity<ApiResponse<Void>> removeSongFromPlaylist(@RequestBody SongToPlaylistRequest request) {
        playlistService.removeSongFromPlaylist(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã xóa bài hát khỏi playlist")
                        .build()
        );
    }
    
    // ===== GET BY ID =====
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{playlistId}")
    public ResponseEntity<ApiResponse<PlaylistResponse>> getPlaylistById(@PathVariable String playlistId) {
        PlaylistResponse response = playlistService.getPlaylistById(playlistId);
        return ResponseEntity.ok(
                ApiResponse.<PlaylistResponse>builder()
                        .success(true)
                        .message("Lấy playlist thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== GET ALL PLAYLIST OF CURRENT USER =====
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<PlaylistResponse>>> getMyPlaylists() {
        List<PlaylistResponse> response = playlistService.getPlaylistsByUser();
        return ResponseEntity.ok(
                ApiResponse.<List<PlaylistResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách playlist thành công")
                        .data(response)
                        .build()
        );
    }

}
