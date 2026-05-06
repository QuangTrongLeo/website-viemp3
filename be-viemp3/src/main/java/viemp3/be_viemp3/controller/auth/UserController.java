package viemp3.be_viemp3.controller.auth;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.auth.UpdateProfileRequest;
import viemp3.be_viemp3.dto.response.auth.UserResponse;
import viemp3.be_viemp3.service.auth.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.vie-mp3-url}/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // ===== GET MY PROFILE =====
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        UserResponse response = userService.getMyProfile();
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Lấy thông tin profile thành công")
                        .data(response)
                        .build()
        );
    }

    // ===== UPDATE PROFILE =====
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@ModelAttribute UpdateProfileRequest request) {
        UserResponse response = userService.updateProfile(request);
        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Cập nhật profile thành công")
                        .data(response)
                        .build()
        );
    }

}
