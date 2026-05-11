package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.music.album.AlbumRequest;
import viemp3.be_viemp3.dto.request.music.album.SongToAlbumRequest;
import viemp3.be_viemp3.dto.response.music.AlbumResponse;
import viemp3.be_viemp3.service.music.AlbumService;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.vie-mp3-url}/albums")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AlbumResponse>> createAlbum(@ModelAttribute AlbumRequest request) {
        AlbumResponse response = albumService.createAlbum(request);
        return ResponseEntity.ok(
                ApiResponse.<AlbumResponse>builder()
                        .success(true)
                        .message("Tạo album thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AlbumResponse>> updateAlbum(
            @PathVariable String id,
            @ModelAttribute AlbumRequest request) {

        AlbumResponse response = albumService.updateAlbum(id, request);
        return ResponseEntity.ok(
                ApiResponse.<AlbumResponse>builder()
                        .success(true)
                        .message("Cập nhật album thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAlbum(@RequestParam String albumId) {
        albumService.deleteAlbum(albumId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xóa album thành công")
                        .build()
        );
    }

    // ===== GET BY ID =====
    @PreAuthorize("permitAll()")
    @GetMapping("/{albumId}")
    public ResponseEntity<ApiResponse<AlbumResponse>> getAlbum(@PathVariable String albumId) {
        AlbumResponse response = albumService.getAlbumById(albumId);
        return ResponseEntity.ok(
                ApiResponse.<AlbumResponse>builder()
                        .success(true)
                        .message("Lấy thông tin album thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== GET ALL =====
    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAllAlbums() {
        List<AlbumResponse> responses = albumService.getAllAlbums();
        return ResponseEntity.ok(
                ApiResponse.<List<AlbumResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách album thành công")
                        .data(responses)
                        .build()
        );
    }

    // ===== ADD SONG TO ALBUM =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping("/add-song")
    public ResponseEntity<ApiResponse<Void>> addSongToAlbum(@RequestBody SongToAlbumRequest request) {
        albumService.addSongToAlbum(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Thêm bài hát vào album thành công")
                        .build()
        );
    }

    // ===== REMOVE SONG FROM ALBUM =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @DeleteMapping("/{songId}/remove-song")
    public ResponseEntity<ApiResponse<Void>> removeSongFromAlbum(@PathVariable String songId) {
        albumService.removeSongFromAlbum(songId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Đã xóa bài hát khỏi album")
                        .build()
        );
    }

    // ===== GET ALL ALBUMS BY ARTIST =====
    @PreAuthorize("permitAll()")
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<ApiResponse<List<AlbumResponse>>> getAlbumsByArtist(@PathVariable String artistId) {
        List<AlbumResponse> responses = albumService.getAlbumsByArtist(artistId);
        return ResponseEntity.ok(
                ApiResponse.<List<AlbumResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách album của nghệ sĩ thành công")
                        .data(responses)
                        .build()
        );
    }
    
}
