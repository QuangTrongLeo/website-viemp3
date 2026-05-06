package viemp3.be_viemp3.service.music;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.music.song.SongRequest;
import viemp3.be_viemp3.dto.response.music.SongResponse;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.entity.Song;
import viemp3.be_viemp3.mapper.music.SongMapper;
import viemp3.be_viemp3.repository.music.SongRepository;
import viemp3.be_viemp3.service.file.FileStorageService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {
    private final SongRepository songRepository;
    private final ListenHistoryService listenHistoryService;
    private final EntityQueryService entityService;
    private final FileStorageService fileStorageService;

    // ===== CREATE =====
    public SongResponse createSong(SongRequest request) {
        Artist artist = entityService.findArtistById(request.getArtistId());
        Genre genre = entityService.findGenreById(request.getGenreId());
        String coverUrl = fileStorageService.upload(request.getCover(), "songs/covers");
        String audioUrl = fileStorageService.upload(request.getAudio(), "songs/audios");

        Song song = new Song();
        song.setTitle(request.getTitle().trim());
        song.setDescription(request.getDescription());
        song.setCover(coverUrl);
        song.setAudio(audioUrl);
        song.setArtist(artist);
        song.setGenre(genre);
        song.setAlbum(null);
        songRepository.save(song);

        return SongMapper.toResponse(song);
    }

    // ===== GET BY ID =====
    public SongResponse getSongById(String songId) {
        Song song = entityService.findSongById(songId);
        listenHistoryService.saveListenHistory(songId);
        return SongMapper.toResponse(song);
    }

    // ===== GET ALL =====
    public List<SongResponse> getAllSongs() {
        return SongMapper.toResponseList(songRepository.findAll());
    }

    // ===== GET SONGS BY GENRE =====
    public List<SongResponse> getSongsByGenre(String genreId) {
        entityService.findGenreById(genreId);
        List<Song> songs = songRepository.findByGenreId(genreId);
        return SongMapper.toResponseList(songs);
    }

    // ===== GET SONGS BY ARTIST =====
    public List<SongResponse> getSongsByArtist(String artistId) {
        entityService.findArtistById(artistId);
        List<Song> songs = songRepository.findByArtistId(artistId);
        return SongMapper.toResponseList(songs);
    }
}
