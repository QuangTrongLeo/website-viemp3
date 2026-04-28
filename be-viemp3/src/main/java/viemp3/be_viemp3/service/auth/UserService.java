package viemp3.be_viemp3.service.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.exception.EmailAlreadyExistsException;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.dto.request.auth.RegisterRequest;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.repository.auth.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final EntityQueryService entityService;
    private final PasswordEncoder passwordEncoder;

    // Tạo user chưa kích hoạt
    public void createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Tài khoản này đã tồn tại!");
        }
        User user = buildUser(request.getUsername(), request.getEmail(), request.getPassword());
        userRepository.save(user);
    }

    // kích hoạt user khi OTP hợp lệ
    public void enableUser(String email) {
        User user = entityService.findUserByEmail(email);
        user.setEnabled(true);
        userRepository.save(user);
    }

    // xóa user chưa kích hoạt (dọn dẹp sau 5 phút)
    public void deleteUserIfNotEnabled(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (!user.isEnabled()) {
                userRepository.delete(user);
            }
        });
    }

    // Tạo user
    public User buildUser(String username, String email, String password){
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(false);
        Role roleUser = entityService.findRoleByName(RoleEnum.USER);
        user.getRoles().add(roleUser);
        return user;
    }

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
