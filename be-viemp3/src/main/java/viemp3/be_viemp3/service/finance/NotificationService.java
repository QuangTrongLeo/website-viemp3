package viemp3.be_viemp3.service.finance;

import viemp3.be_viemp3.entity.Album;
import viemp3.be_viemp3.entity.Artist;
import viemp3.be_viemp3.entity.FavoriteArtist;
import viemp3.be_viemp3.entity.Notification;
import viemp3.be_viemp3.repository.music.FavoriteArtistRepository;
import viemp3.be_viemp3.repository.finance.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final FavoriteArtistRepository favoriteArtistRepository;

    public void notifyNewAlbum(Artist artist, Album album) {
        List<FavoriteArtist> favorites = favoriteArtistRepository.findByArtistId(artist.getId());
        for (FavoriteArtist favorite : favorites) {
            Notification notification = new Notification();
            notification.setUser(favorite.getUser());
            notification.setTitle(artist.getName() + " vừa ra mắt album \"" + album.getTitle() + "\"");
            notification.setCover(album.getCover());
            notificationRepository.save(notification);
        }
    }

}
