package viemp3.be_viemp3.service.auth;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.auth.LoginRequest;
import viemp3.be_viemp3.dto.response.auth.TokenResponse;
import viemp3.be_viemp3.entity.User;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final EntityQueryService entityService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // Đăng nhập
    public TokenResponse login(LoginRequest request) {
        User user = entityService.findUserByEmail(request.getEmail());

        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa kích hoạt!");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu!");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse refreshToken(String refreshToken) {
        // lấy email từ token
        String email = jwtService.extractEmail(refreshToken);
        User user = entityService.findUserByEmail(email);
        // kiểm tra token hết hạn
        if (jwtService.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token đã hết hạn");
        }

        // tạo access token mới
        String newAccessToken = jwtService.generateAccessToken(user);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .build();
    }
}


