package viemp3.be_viemp3.service.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import viemp3.be_viemp3.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String jwtSecret;

    @Value("${jwt.accessToken.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;

    @Value("${jwt.refreshToken.expiration}")
    private long REFRESH_TOKEN_EXPIRATION;

    /**
     * Tạo Access Token
     */
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("roles", user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .toList())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Tạo Refresh Token
     */
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Lấy key ký JWT từ Base64 secret
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
    }

    /**
     * Trích xuất email (subject) từ token
     */
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Trích xuất roles từ token
     */
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

    /**
     * Giải mã toàn bộ claims từ token
     */
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token đã hết hạn", e);
        } catch (JwtException e) {
            throw new RuntimeException("JWT không hợp lệ", e);
        }
    }

    /**
     * Kiểm tra token có hết hạn hay chưa
     */
    public boolean isTokenExpired(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    /**
     * Kiểm tra token hợp lệ (email khớp và chưa hết hạn)
     */
    public boolean isTokenValid(String token, User user) {
        final String email = extractEmail(token);
        return (email.equals(user.getEmail()) && !isTokenExpired(token));
    }
}
