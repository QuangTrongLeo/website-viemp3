package viemp3.be_viemp3.controller.music;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.service.music.FavoriteAlbumService;
import viemp3.be_viemp3.common.response.ApiResponse;


@RestController
@RequestMapping("${api.vie-mp3-url}/favorite-albums")
@RequiredArgsConstructor
public class FavoriteAlbumController {
    private final FavoriteAlbumService favoriteAlbumService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{albumId}")
    public ResponseEntity<ApiResponse<Void>> addAlbumToFavorite(@PathVariable String albumId) {
        favoriteAlbumService.addAlbumToFavorite(albumId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã thêm album vào danh sách yêu thích")
                        .build()
        );
    }
    
}
