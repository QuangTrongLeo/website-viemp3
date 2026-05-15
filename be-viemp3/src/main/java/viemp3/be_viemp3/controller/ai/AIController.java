package be_viemp3.viemp3.controller.ai;

import be_viemp3.viemp3.common.response.ApiResponse;
import be_viemp3.viemp3.dto.request.ai.ChatRequest;
import be_viemp3.viemp3.service.ai.ChatAIService;
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

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> chatAI(@RequestBody ChatRequest request) {
        String response = chatService.chatAI(request);

        // Trả về ApiResponse với data là kết quả AI
        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Gửi chat thành công")
                        .data(response)  // Gán kết quả AI vào data
                        .build()
        );
    }
}
