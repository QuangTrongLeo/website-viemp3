package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.music.song.SongRequest;
import viemp3.be_viemp3.dto.response.music.SongResponse;
import viemp3.be_viemp3.service.music.SongService;

@RestController
@RequestMapping("${api.vie-mp3-url}/songs")
@RequiredArgsConstructor
public class SongController {
    private final SongService songService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<SongResponse>> createSong(@ModelAttribute SongRequest request) {
        SongResponse response = songService.createSong(request);
        return ResponseEntity.ok(
                ApiResponse.<SongResponse>builder()
                        .success(true)
                        .message("Tạo bài hát thành công")
                        .data(response)
                        .build()
        );
    }
}
