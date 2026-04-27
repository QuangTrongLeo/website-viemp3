package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "listen_history",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "song_id"})
)
public class ListenHistory {

    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime listenedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id")
    private Song song;
}