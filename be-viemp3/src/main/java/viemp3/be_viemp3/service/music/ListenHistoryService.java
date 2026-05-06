package viemp3.be_viemp3.service.music;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.entity.ListenHistory;
import viemp3.be_viemp3.entity.Song;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.repository.music.ListenHistoryRepository;
import viemp3.be_viemp3.repository.music.SongRepository;
import viemp3.be_viemp3.service.auth.SecurityService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ListenHistoryService {
    private final ListenHistoryRepository listenHistoryRepository;
    private final SongRepository songRepository;
    private final EntityQueryService entityService;
    private final SecurityService securityService;
    private static final int MAX_HISTORY = 30;

    @Transactional
    public void saveListenHistory(String songId) {
        User user = securityService.getCurrentUser();
        Song song = entityService.findSongById(songId);
        Optional<ListenHistory> optional = listenHistoryRepository.findByUserIdAndSongId(user.getId(), songId);
        if (optional.isPresent()) {
            ListenHistory history = optional.get();
            history.setListenedAt(OffsetDateTime.now());
            listenHistoryRepository.save(history);
        } else {
            ListenHistory history = new ListenHistory();
            history.setUser(user);
            history.setSong(song);
            listenHistoryRepository.save(history);

            // Giới hạn 30 bản ghi
            long count = listenHistoryRepository.countByUserId(user.getId());
            if (count > MAX_HISTORY) {
                List<ListenHistory> histories = listenHistoryRepository.findByUserIdOrderByListenedAtAsc(user.getId());
                int needDelete = (int) (count - MAX_HISTORY);
                for (int i = 0; i < needDelete; i++) {
                    listenHistoryRepository.deleteById(histories.get(i).getId());
                }
            }
        }

        songRepository.incrementListenCount(songId);
    }
}
