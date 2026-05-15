package viemp3.be_viemp3.dto.request.music.playlist;

import lombok.Data;

@Data
public class SongToPlaylistRequest {
    private String playlistId;
    private String songId;
}
