package viemp3.be_viemp3.service.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.repository.auth.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EntityQueryService entityService;

    @Transactional
    public User processOAuthPostLogin(String username, String email, String avatar) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            // Chỉ chạy đoạn này nếu không tìm thấy email trong DB
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(username);
            newUser.setAvatar(avatar);
            newUser.setPassword(""); // OAuth2 không cần password
            newUser.setEnabled(true); // Tin tưởng xác thực từ Google

            // Gán Role mặc định
            Role roleUser = entityService.findRoleByName(RoleEnum.USER);
            newUser.getRoles().add(roleUser);

            return userRepository.save(newUser);
        });
    }
}
