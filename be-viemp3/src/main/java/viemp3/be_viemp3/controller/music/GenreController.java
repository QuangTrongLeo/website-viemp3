package viemp3.be_viemp3.controller.music;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.music.genre.GenreRequest;
import viemp3.be_viemp3.dto.response.music.GenreResponse;
import viemp3.be_viemp3.service.music.GenreService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/genres")
@RequiredArgsConstructor
public class GenreController {
    private final GenreService genreService;

    // ===== CREATE =====
    @PreAuthorize("hasAnyRole('ADMIN','MOD')")
    @PostMapping()
    public ResponseEntity<ApiResponse<GenreResponse>> createGenre(@RequestBody @Valid GenreRequest request) {
        GenreResponse response = genreService.createGenre(request);
        return ResponseEntity.ok(
                ApiResponse.<GenreResponse>builder()
                        .success(true)
                        .message("Tạo genre thành công")
                        .data(response)
                        .build()
        );
    }

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

    // ===== GET BY ID =====
    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GenreResponse>> getGenreById(@PathVariable String id) {
        GenreResponse response = genreService.getGenreById(id);
        return ResponseEntity.ok(ApiResponse.<GenreResponse>builder()
                        .success(true)
                        .message("Lấy genre thành công")
                        .data(response)
                        .build()
        );
    }
}
