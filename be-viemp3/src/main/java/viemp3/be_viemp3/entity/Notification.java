package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private String id;

    private String title;

    private String cover;

    private boolean isRead = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime notificationAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    
}