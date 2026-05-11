package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.music.FavoriteSongResponse;
import viemp3.be_viemp3.service.music.FavoriteSongService;

import java.util.List;

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

    // ===== REMOVE SONG FROM FAVORITE =====
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{songId}")
    public ResponseEntity<ApiResponse<Void>> removeSongFromFavorite(@PathVariable String songId) {
        favoriteSongService.removeSongFromFavorite(songId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã xóa bài hát khỏi danh sách yêu thích")
                        .build()
        );
    }

    // ===== GET MY FAVORITE SONGS =====
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<FavoriteSongResponse>>> getMyFavoriteSongs() {
        List<FavoriteSongResponse> response = favoriteSongService.getMyFavoriteSongs();
        return ResponseEntity.ok(
                ApiResponse.<List<FavoriteSongResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách bài hát yêu thích thành công")
                        .data(response)
                        .build()
        );
    }
}
