package viemp3.be_viemp3.repository.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import viemp3.be_viemp3.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserIdOrderByNotificationAtDesc(String userId);
}
