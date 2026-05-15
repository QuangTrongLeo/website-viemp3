package viemp3.be_viemp3.controller.music;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.service.music.FavoriteAlbumService;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.music.FavoriteAlbumResponse;


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

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{albumId}")
    public ResponseEntity<ApiResponse<Void>> removeAlbumFromFavorite(@PathVariable String albumId) {
        favoriteAlbumService.removeAlbumFromFavorite(albumId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã xóa album khỏi danh sách yêu thích")
                        .build()
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<FavoriteAlbumResponse>>> getMyFavoriteAlbums() {
        List<FavoriteAlbumResponse> responses = favoriteAlbumService.getMyFavoriteAlbums();
        return ResponseEntity.ok(
                ApiResponse.<List<FavoriteAlbumResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách album yêu thích thành công")
                        .data(responses)
                        .build()
        );
    }
    
}
