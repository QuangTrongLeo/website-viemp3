package viemp3.be_viemp3.dto.request.music.artist;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ArtistRequest {
    private String name;
    private MultipartFile avatar;
}
