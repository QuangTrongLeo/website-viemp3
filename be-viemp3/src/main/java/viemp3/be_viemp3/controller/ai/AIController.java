package viemp3.be_viemp3.controller.ai;

import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.ai.ChatRequest;
import viemp3.be_viemp3.service.ai.ChatAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.vie-mp3-url}/ai")
@RequiredArgsConstructor
public class AIController {
    private final ChatAIService chatService;

    @PostMapping("/chat")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Object>> chatAI(@RequestBody ChatRequest request) {
        Object response = chatService.chatAI(request);
        return ResponseEntity.ok(
                ApiResponse.<Object>builder()
                        .success(true)
                        .message("Gửi chat thành công")
                        .data(response)
                        .build()
        );
    }
}
