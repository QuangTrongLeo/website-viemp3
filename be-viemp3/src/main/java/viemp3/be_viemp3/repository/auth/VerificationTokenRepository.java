package viemp3.be_viemp3.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import viemp3.be_viemp3.entity.VerificationToken;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
    Optional<VerificationToken> findByEmailAndOtpAndUsedFalse(String email, String otp);
}
