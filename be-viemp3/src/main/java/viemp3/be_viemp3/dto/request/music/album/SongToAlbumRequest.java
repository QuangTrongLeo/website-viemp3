package viemp3.be_viemp3.dto.request.music.album;

import lombok.Data;

@Data
public class SongToAlbumRequest {
    private String albumId;
    private String songId;
}