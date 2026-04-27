package viemp3.be_viemp3.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import viemp3.be_viemp3.security.JwtAuthenticationFilter;

import java.util.Arrays;
import java.util.stream.Stream;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${api.vie-mp3-url}")
    private String baseUrl;

    // ===== SECURITY FILTER CHAIN =====
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // 1. Danh sách các endpoint thuần túy
        String[] apiPaths = {
                "/ai/**",
                "/auth/**",
                "/analytics/**",
                "/artists/**",
                "/albums/**",
                "/favorite-artists/**",
                "/favorite-albums/**",
                "/genres/**",
                "/listen-histories/**",
                "/playlists/**",
                "/songs/**",
                "/users/**",
                "/notifications/**",
                "/packages/**",
                "/payments/**",
                "/vouchers/**"
        };

        // 2. Các endpoint hệ thống đặc biệt
        String[] staticPaths = {"/login/**", "/oauth2/**"};

        // 3. Hợp nhất và nối chuỗi baseUrl tự động
        String[] publicEndpoints = Stream.concat(
                Arrays.stream(staticPaths),
                Arrays.stream(apiPaths).map(path -> baseUrl + path)
        ).toArray(String[]::new);

        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(publicEndpoints).permitAll()
                        .anyRequest().authenticated()
                )
//                .oauth2Login(oauth -> oauth
//                        .successHandler(oAuth2SuccessHandler)
//                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // ===== AUTHENTICATION MANAGER =====
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
