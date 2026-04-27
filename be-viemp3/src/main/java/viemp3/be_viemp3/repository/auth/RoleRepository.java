package viemp3.be_viemp3.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.enums.RoleEnum;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(RoleEnum role);
    boolean existsByName(RoleEnum role);
}
