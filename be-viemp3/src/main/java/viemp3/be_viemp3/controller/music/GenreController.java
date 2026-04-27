package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.service.music.GenreService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/genres")
@RequiredArgsConstructor
public class GenreController {
    private final GenreService genreService;

    // ===== GET ALL =====
    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<GenreResponse>>> getAllGenres() {
        List<GenreResponse> response = genreService.getAllGenres();
        return ResponseEntity.ok(ApiResponse.<List<GenreResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách genre thành công")
                        .data(response)
                        .build()
        );
    }
}
