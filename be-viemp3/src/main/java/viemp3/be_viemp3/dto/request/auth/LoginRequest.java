package viemp3.be_viemp3.dto.request.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
