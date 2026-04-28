package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.music.artist.ArtistRequest;
import viemp3.be_viemp3.dto.response.music.ArtistResponse;
import viemp3.be_viemp3.service.music.ArtistService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/artists")
@RequiredArgsConstructor
public class ArtistController {
    private final ArtistService artistService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ArtistResponse>> createArtist(@ModelAttribute ArtistRequest request) {
        ArtistResponse response = artistService.createArtist(request);
        return ResponseEntity.ok(
                ApiResponse.<ArtistResponse>builder()
                        .success(true)
                        .message("Tạo nghệ sĩ thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ArtistResponse>> updateArtist(
            @PathVariable("id") String id,
            @ModelAttribute ArtistRequest request) {

        return ResponseEntity.ok(
                ApiResponse.<ArtistResponse>builder()
                        .success(true)
                        .message("Cập nhật nghệ sĩ thành công")
                        .data(artistService.updateArtist(id, request))
                        .build()
        );
    }

    // ===== DELETE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteArtist(@RequestParam("artistId") String artistId) {
        artistService.deleteArtist(artistId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xóa nghệ sĩ thành công")
                        .build()
        );
    }

    // ===== GET ALL ARTIST =====
    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ArtistResponse>>> getAllArtists() {
        List<ArtistResponse> responses = artistService.getAllArtists();
        return ResponseEntity.ok(
                ApiResponse.<List<ArtistResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách nghệ sĩ thành công")
                        .data(responses)
                        .build()
        );
    }

    // ===== GET ARTIST =====
    @PreAuthorize("permitAll()")
    @GetMapping("/{artistId}")
    public ResponseEntity<ApiResponse<ArtistResponse>> getArtist(@PathVariable String artistId) {
        ArtistResponse response = artistService.getArtistById(artistId);
        return ResponseEntity.ok(
                ApiResponse.<ArtistResponse>builder()
                        .success(true)
                        .message("Lấy thông tin nghệ sĩ thành công")
                        .data(response)
                        .build()
        );
    }
}