package viemp3.be_viemp3.dto.request.auth;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateProfileRequest {
    private String username;
    private MultipartFile avatar;
}

