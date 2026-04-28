package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private String id;

    private String token;

    private LocalDateTime expiryDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}


