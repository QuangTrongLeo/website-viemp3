package viemp3.be_viemp3.dto.response.music;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class ArtistResponse {
    private String id;
    private String name;
    private String avatar;
    private int favorites;
    private OffsetDateTime createdAt;
}
