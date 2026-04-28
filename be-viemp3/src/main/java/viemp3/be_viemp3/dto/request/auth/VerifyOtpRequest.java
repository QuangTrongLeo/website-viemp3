package viemp3.be_viemp3.dto.request.auth;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}
