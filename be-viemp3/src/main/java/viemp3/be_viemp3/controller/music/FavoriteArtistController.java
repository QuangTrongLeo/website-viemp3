package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.music.FavoriteArtistResponse;
import viemp3.be_viemp3.service.music.FavoriteArtistService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/favorite-artists")
@RequiredArgsConstructor
public class FavoriteArtistController {
    private final FavoriteArtistService favoriteArtistService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{artistId}")
    public ResponseEntity<ApiResponse<Void>> addArtistToFavorite(@PathVariable String artistId) {
        favoriteArtistService.addArtistToFavorite(artistId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã thêm nghệ sĩ vào danh sách yêu thích")
                        .build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{artistId}")
    public ResponseEntity<ApiResponse<Void>> removeArtistFromFavorite(@PathVariable String artistId) {
        favoriteArtistService.removeArtistFromFavorite(artistId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã xóa nghệ sĩ khỏi danh sách yêu thích")
                        .build()
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteArtistResponse>>> getMyFavoriteArtists() {
        List<FavoriteArtistResponse> responses = favoriteArtistService.getMyFavoriteArtists();
        return ResponseEntity.ok(
                ApiResponse.<List<FavoriteArtistResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách nghệ sĩ yêu thích thành công")
                        .data(responses)
                        .build()
        );
    }
}
