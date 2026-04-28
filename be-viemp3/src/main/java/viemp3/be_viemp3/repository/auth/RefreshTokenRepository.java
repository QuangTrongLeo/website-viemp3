package viemp3.be_viemp3.repository.auth;

import viemp3.be_viemp3.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
}