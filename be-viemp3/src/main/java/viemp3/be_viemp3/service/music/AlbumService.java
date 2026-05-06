package viemp3.be_viemp3.service.music;

import java.util.List;

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

    // ===== UPDATE =====
    public AlbumResponse updateAlbum(String id, AlbumRequest request) {
        Album album = entityQueryService.findAlbumById(id);
        boolean isUpdated = false;
        // update title
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            album.setTitle(request.getTitle().trim());
            isUpdated = true;
        }
        // update cover
        if (request.getCover() != null && !request.getCover().isEmpty()) {
            if (album.getCover() != null && !album.getCover().isBlank()) {
                fileStorageService.deleteByUrl(album.getCover());
            }
            String newCover = fileStorageService.upload(request.getCover(), "albums");
            album.setCover(newCover);
            isUpdated = true;
        }
        if (!isUpdated) {
            throw new IllegalArgumentException("Không có dữ liệu để cập nhật");
        }
        albumRepository.save(album);
        return AlbumMapper.toResponse(album);
    }
    
    // ===== DELETE =====
    public void deleteAlbum(String albumId) {
        Album album = entityQueryService.findAlbumById(albumId);
        if (album.getCover() != null) {
            fileStorageService.deleteByUrl(album.getCover());
        }
        albumRepository.delete(album);
    }
    
    // ===== GET BY ID =====
    public AlbumResponse getAlbumById(String albumId) {
        return AlbumMapper.toResponse(entityQueryService.findAlbumById(albumId));
    }

    // ===== GET ALL =====
    public List<AlbumResponse> getAllAlbums() {
        return AlbumMapper.toResponseList(albumRepository.findAll());
    }
    
}
