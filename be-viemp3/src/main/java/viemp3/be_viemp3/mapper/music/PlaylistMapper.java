package viemp3.be_viemp3.mapper.music;

import java.util.List;
import java.util.stream.Collectors;

import viemp3.be_viemp3.dto.response.music.PlaylistResponse;
import viemp3.be_viemp3.entity.Playlist;

public class PlaylistMapper {
    public static PlaylistResponse toResponse(Playlist playlist) {
        if (playlist == null) return null;
        PlaylistResponse response = new PlaylistResponse();
        response.setId(playlist.getId());
        response.setName(playlist.getName());
        response.setCover(playlist.getCover());
        response.setCreatedAt(playlist.getCreatedAt());
        if (playlist.getUser() != null) {
            response.setUserId(playlist.getUser().getId());
        }
        if (playlist.getSongs() != null) {
            response.setSongs(
                    playlist.getSongs()
                            .stream()
                            .map(SongMapper::toResponse)
                            .collect(Collectors.toList())
            );
        }
        return response;
    }

    public static List<PlaylistResponse> toResponseList(List<Playlist> playlists) {
        if (playlists == null) return List.of();
        return playlists.stream()
                .map(PlaylistMapper::toResponse)
                .collect(Collectors.toList());
    }
}

