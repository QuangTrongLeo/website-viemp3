package viemp3.be_viemp3.service.music;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.dto.request.music.artist.ArtistRequest;
import viemp3.be_viemp3.dto.response.music.ArtistResponse;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.mapper.music.ArtistMapper;
import viemp3.be_viemp3.repository.music.ArtistRepository;
import viemp3.be_viemp3.service.file.FileStorageService;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
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
}
