package viemp3.be_viemp3.service.analytic;

import viemp3.be_viemp3.dto.response.analytics.UserStatisticsResponse;
import viemp3.be_viemp3.enums.RoleEnum; // Import Enum
import viemp3.be_viemp3.mapper.analytics.UserStatisticsMapper;
import viemp3.be_viemp3.repository.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserStatisticsService {
    private final UserRepository userRepository;
    private final UserStatisticsMapper userStatisticsMapper;

    // 1. Thống kê theo trạng thái (Active vs Banned)
    public List<UserStatisticsResponse> getStatusStatistics() {
        long total = userRepository.countTotalUsers();
        long enabled = userRepository.countByEnabled(true);
        long disabled = total - enabled;

        return List.of(
                userStatisticsMapper.toResponse("Đang hoạt động", enabled, total),
                userStatisticsMapper.toResponse("Đang bị khóa", disabled, total)
        );
    }

    // 2. Thống kê theo vai trò hệ thống
    public List<UserStatisticsResponse> getSystemRoleStatistics() {
        long total = userRepository.countTotalUsers();

        // PHẢI dùng RoleEnum thay vì String
        return List.of(
                userStatisticsMapper.toResponse("Quản trị viên", userRepository.countByRoleName(RoleEnum.ADMIN), total),
                userStatisticsMapper.toResponse("Điều phối viên", userRepository.countByRoleName(RoleEnum.MOD), total),
                userStatisticsMapper.toResponse("Thành viên", userRepository.countByRoleName(RoleEnum.USER), total)
        );
    }

    // 3. Thống kê Hội viên (Premium vs Free)
    public List<UserStatisticsResponse> getMembershipStatistics() {
        long total = userRepository.countTotalUsers();
        long premiumCount = userRepository.countByRoleName(RoleEnum.PREMIUM);

        // Bạn có thể dùng logic trừ hoặc gọi hàm countFreeUsers() đã viết ở Repo
        long freeCount = userRepository.countFreeUsers();

        return List.of(
                userStatisticsMapper.toResponse("Hội viên Premium", premiumCount, total),
                userStatisticsMapper.toResponse("Người dùng miễn phí", freeCount, total)
        );
    }
}
