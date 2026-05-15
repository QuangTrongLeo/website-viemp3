package viemp3.be_viemp3.dto.request.music.playlist;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class PlaylistRequest {
    private String name;
    private MultipartFile cover;
}
