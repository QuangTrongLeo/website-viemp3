package viemp3.be_viemp3.service.music;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.music.artist.ArtistRequest;
import viemp3.be_viemp3.dto.response.music.ArtistResponse;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.mapper.music.ArtistMapper;
import viemp3.be_viemp3.repository.music.ArtistRepository;
import viemp3.be_viemp3.service.file.FileStorageService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final EntityQueryService entityService;
    private final FileStorageService fileStorageService;

    // ===== CREATE =====
    public ArtistResponse createArtist(ArtistRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Tên nghệ sĩ không được để trống");
        }
        String avatarUrl = null;
        // Chỉ upload nếu có file
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            avatarUrl = fileStorageService.upload(request.getAvatar(), "artists");
        }
        Artist artist = new Artist();
        artist.setName(request.getName().trim());
        artist.setAvatar(avatarUrl);
        artist.setFavorites(100000);
        Artist savedArtist = artistRepository.save(artist);
        return ArtistMapper.toResponse(savedArtist);
    }

    // ===== UPDATE =====
    public ArtistResponse updateArtist(String id, ArtistRequest request) {
        Artist artist = entityService.findArtistById(id);
        boolean isUpdated = false;

        // ===== UPDATE NAME =====
        if (request.getName() != null && !request.getName().isBlank()) {
            artist.setName(request.getName().trim());
            isUpdated = true;
        }

        // ===== UPDATE AVATAR =====
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            // Xóa avatar cũ nếu có
            if (artist.getAvatar() != null && !artist.getAvatar().isBlank()) {
                fileStorageService.deleteByUrl(artist.getAvatar());
            }
            String newAvatarUrl = fileStorageService.upload(request.getAvatar(), "artists");
            artist.setAvatar(newAvatarUrl);
            isUpdated = true;
        }

        if (!isUpdated) {
            throw new IllegalArgumentException("Không có dữ liệu nào để cập nhật");
        }
        artistRepository.save(artist);
        return ArtistMapper.toResponse(artist);
    }

    // ===== DELETE =====
    public void deleteArtist(String artistId) {
        Artist artist = entityService.findArtistById(artistId);
        fileStorageService.deleteByUrl(artist.getAvatar());
        artistRepository.delete(artist);
    }

    // ===== GET ALL ARTIST =====
    public List<ArtistResponse> getAllArtists() {
        return ArtistMapper.toResponseList(artistRepository.findAll());
    }

    // ===== GET BY ID =====
    public ArtistResponse getArtistById(String artistId) {
        return ArtistMapper.toResponse(entityService.findArtistById(artistId));
    }

    // ===== GET BY NAME =====
    public ArtistResponse getArtistByName(String artistName) {
        return ArtistMapper.toResponse(entityService.findArtistByName(artistName));
    }
}
