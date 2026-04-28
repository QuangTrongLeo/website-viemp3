package viemp3.be_viemp3.service.auth;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import viemp3.be_viemp3.common.exception.VerifyOtpException;
import viemp3.be_viemp3.entity.VerificationToken;
import viemp3.be_viemp3.repository.auth.VerificationTokenRepository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final UserService userService;
    private final TaskScheduler taskScheduler;

    // TẠO VÀ GỬI OTP
    public void createAndSendOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        VerificationToken token = createOtp(email, otp);
        verificationTokenRepository.save(token);

        emailService.sendOtp(email, otp);

        // Lên lịch xóa user sau 5 phút nếu chưa xác thựcs
        taskScheduler.schedule(
                () -> userService.deleteUserIfNotEnabled(email),
                token.getExpiryDate().atZone(ZoneId.systemDefault()).toInstant()
        );
    }

    // XÁC THỰC OTP
    public void verifyOtp(String email, String otp) {
        VerificationToken token = verificationTokenRepository
                .findByEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new VerifyOtpException("OTP không hợp lệ"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            userService.deleteUserIfNotEnabled(email);
            throw new VerifyOtpException("OTP đã hết hạn");
        }

        token.setUsed(true);
        verificationTokenRepository.save(token);
        userService.enableUser(email);
    }

    private VerificationToken createOtp(String email, String otp) {
        VerificationToken token = new VerificationToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        token.setUsed(false);
        return token;
    }
}


