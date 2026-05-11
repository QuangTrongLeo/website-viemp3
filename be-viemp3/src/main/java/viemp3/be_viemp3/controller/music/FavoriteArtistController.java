package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.service.music.FavoriteArtistService;

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
}
