package viemp3.be_viemp3.controller.auth;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.auth.LoginRequest;
import viemp3.be_viemp3.dto.request.auth.RefreshTokenRequest;
import viemp3.be_viemp3.dto.request.auth.RegisterRequest;
import viemp3.be_viemp3.dto.request.auth.VerifyOtpRequest;
import viemp3.be_viemp3.dto.response.auth.TokenResponse;
import viemp3.be_viemp3.service.auth.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.vie-mp3-url}/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    // ===== REGISTER =====
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("OTP đã được gửi tới email: " + request.getEmail())
                        .build()
        );
    }

    // ===== VERIFY OTP =====
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Xác thực tài khoản thành công")
                        .build()
        );
    }

    // ===== LOGIN =====
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@RequestBody LoginRequest request) {
        TokenResponse tokenResponse = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.<TokenResponse>builder()
                        .success(true)
                        .message("Đăng nhập thành công")
                        .data(tokenResponse)
                        .build()
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        TokenResponse tokenResponse = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(
                ApiResponse.<TokenResponse>builder()
                        .success(true)
                        .message("Refresh token thành công")
                        .data(tokenResponse)
                        .build()
        );
    }
}
