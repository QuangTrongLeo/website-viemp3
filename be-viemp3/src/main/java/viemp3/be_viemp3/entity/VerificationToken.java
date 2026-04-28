package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "verification_tokens")
public class VerificationToken {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private String id;

    private String email;

    private String otp;

    private LocalDateTime expiryDate;

    private boolean used = false;
}

