package viemp3.be_viemp3.mapper.music;

import viemp3.be_viemp3.dto.response.music.SongResponse;
import viemp3.be_viemp3.entity.Song;

import java.util.List;
import java.util.stream.Collectors;

public class SongMapper {

    public static SongResponse toResponse(Song song) {
        if (song == null) return null;
        return SongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .cover(song.getCover())
                .audio(song.getAudio())
                .description(song.getDescription())
                .artistId(song.getArtist() != null ? song.getArtist().getId() : null)
                .albumId(song.getAlbum() != null ? song.getAlbum().getId() : null)
                .genreId(song.getGenre() != null ? song.getGenre().getId() : null)
                .favorites(song.getFavorites())
                .listenCount(song.getListenCount())
                .createdAt(song.getCreatedAt())
                .build();
    }

    public static List<SongResponse> toResponseList(List<Song> songs) {
        if (songs == null) return List.of();
        return songs.stream()
                .map(SongMapper::toResponse)
                .collect(Collectors.toList());
    }
}
