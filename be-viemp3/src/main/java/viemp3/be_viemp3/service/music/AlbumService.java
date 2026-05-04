package viemp3.be_viemp3.service.music;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.music.album.AlbumRequest;
import viemp3.be_viemp3.dto.response.music.AlbumResponse;
import viemp3.be_viemp3.entity.Album;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.mapper.music.AlbumMapper;
import viemp3.be_viemp3.repository.music.AlbumRepository;
import viemp3.be_viemp3.service.file.FileStorageService;
import viemp3.be_viemp3.service.finance.NotificationService;

@Service
@RequiredArgsConstructor
public class AlbumService {
    private final AlbumRepository albumRepository;
    private final NotificationService notificationService;
    private final EntityQueryService entityQueryService;
    private final FileStorageService fileStorageService;

    // ===== CREATE =====
    public AlbumResponse createAlbum(AlbumRequest request) {
        Artist artist = entityQueryService.findArtistById(request.getArtistId());
        String coverUrl = fileStorageService.upload(request.getCover(), "albums");
        Album album = new Album();
        album.setTitle(request.getTitle().trim());
        album.setCover(coverUrl);
        album.setArtist(artist);
        albumRepository.save(album);
        notificationService.notifyNewAlbum(artist, album);
        return AlbumMapper.toResponse(album);
    }
    
}
