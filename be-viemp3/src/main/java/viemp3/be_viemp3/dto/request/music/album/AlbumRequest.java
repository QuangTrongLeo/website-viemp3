package viemp3.be_viemp3.dto.request.music.album;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class AlbumRequest {
    private String title;
    private MultipartFile cover;
    private String artistId;
}
