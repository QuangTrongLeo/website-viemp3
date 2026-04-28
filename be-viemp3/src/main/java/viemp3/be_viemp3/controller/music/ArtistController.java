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
}