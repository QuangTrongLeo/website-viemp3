package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import viemp3.be_viemp3.entity.ListenHistory;

import java.util.List;
import java.util.Optional;

public interface ListenHistoryRepository extends JpaRepository<ListenHistory, String> {
    Optional<ListenHistory> findByUserIdAndSongId(String userId, String songId);
    List<ListenHistory> findByUserIdOrderByListenedAtAsc(String userId);
    List<ListenHistory> findByUserIdOrderByListenedAtDesc(String userId);
    List<ListenHistory> findByUserId(String userId);
    long countByUserId(String userId);

    // Thống kê theo ngày
    @Query(value = """
        SELECT 
            DATE_FORMAT(lh.listened_at, '%Y-%m-%d') as period, 
            SUM(s.listen_count) as totalListen 
        FROM listen_history lh
        JOIN songs s ON lh.song_id = s.id
        GROUP BY period 
        ORDER BY period ASC
    """, nativeQuery = true)
    List<Object[]> getListenStatsByDayNative();
}
