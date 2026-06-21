package viemp3.be_viemp3.repository.auth;

import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.enums.RoleEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    // 1. Thống kê theo trạng thái
    long countByEnabled(boolean enabled);

    // 2. Thống kê theo tên Role (Sử dụng RoleEnum thay vì String để tránh lỗi mapping)
    @Query("SELECT COUNT(DISTINCT u) FROM User u JOIN u.roles r WHERE r.name = :roleName")
    long countByRoleName(@Param("roleName") RoleEnum roleName);

    // 3. Đếm tổng số lượng user
    @Query("SELECT COUNT(u) FROM User u")
    long countTotalUsers();

    // 4. Thống kê User không có Premium (Dùng Full path cho Enum)
    @Query("SELECT COUNT(u) FROM User u WHERE NOT EXISTS " +
            "(SELECT 1 FROM u.roles r WHERE r.name = viemp3.be_viemp3.enums.RoleEnum.PREMIUM)")
    long countFreeUsers();
}
