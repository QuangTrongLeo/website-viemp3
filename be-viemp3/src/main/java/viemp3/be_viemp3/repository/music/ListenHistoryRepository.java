package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import viemp3.be_viemp3.entity.ListenHistory;

import java.util.List;
import java.util.Optional;

public interface ListenHistoryRepository extends JpaRepository<ListenHistory, String> {
    Optional<ListenHistory> findByUserIdAndSongId(String userId, String songId);
    List<ListenHistory> findByUserIdOrderByListenedAtAsc(String userId);
    long countByUserId(String userId);
}
