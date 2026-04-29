package viemp3.be_viemp3.dto.request.music.song;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SongRequest {
    private String title;
    private String description;
    private String artistId;
    private String genreId;
    private String albumId;
    private MultipartFile cover;
    private MultipartFile audio;
}
