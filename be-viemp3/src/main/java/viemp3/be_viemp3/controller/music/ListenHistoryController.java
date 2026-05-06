package viemp3.be_viemp3.controller.music;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.response.music.ListenHistoryResponse;
import viemp3.be_viemp3.service.music.ListenHistoryService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/listen-histories")
@RequiredArgsConstructor
public class ListenHistoryController {
    private final ListenHistoryService listenHistoryService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ListenHistoryResponse>>> getMyListenHistory() {
        List<ListenHistoryResponse> responses = listenHistoryService.getMyListenHistory();
        return ResponseEntity.ok(
                ApiResponse.<List<ListenHistoryResponse>>builder()
                        .success(true)
                        .message("Lấy lịch sử nghe nhạc thành công")
                        .data(responses)
                        .build()
        );
    }
}
