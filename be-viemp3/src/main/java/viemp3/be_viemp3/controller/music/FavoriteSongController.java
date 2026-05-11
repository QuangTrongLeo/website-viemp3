package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.service.music.FavoriteSongService;

@RestController
@RequestMapping("${api.vie-mp3-url}/favorite-songs")
@RequiredArgsConstructor
public class FavoriteSongController {
    private final FavoriteSongService favoriteSongService;

    // ===== ADD SONG TO FAVORITE =====
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{songId}")
    public ResponseEntity<ApiResponse<Void>> addSongToFavorite(@PathVariable String songId) {
        favoriteSongService.addSongToFavorite(songId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã thêm bài hát vào danh sách yêu thích")
                        .build()
        );
    }
}
