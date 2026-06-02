package viemp3.be_viemp3.controller.finance;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.service.finance.PaymentService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.vie-mp3-url}/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PreAuthorize("hasAnyRole('ADMIN','MOD','USER')")
    @PostMapping("/payment-url/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createPaymentUrl(
            @PathVariable String id,
            HttpServletRequest httpRequest) {

        String paymentUrl = paymentService.createPaymentUrl(id, httpRequest);
        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(
                ApiResponse.<Map<String, String>>builder()
                        .success(true)
                        .message("Tạo đường dẫn thanh toán VNPay thành công")
                        .data(result)
                        .build()
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','MOD','USER')")
    @GetMapping("/payment-callback")
    public ResponseEntity<ApiResponse<Boolean>> getPaymentCallback(
            @RequestParam Map<String, String> allParams) {

        boolean isSuccess = paymentService.processPaymentCallback(allParams);

        if (isSuccess) {
            return ResponseEntity.ok(
                    ApiResponse.<Boolean>builder()
                            .success(true)
                            .message("Thanh toán và nâng cấp Premium thành công")
                            .data(true)
                            .build()
            );
        } else {
            return ResponseEntity.ok(
                    ApiResponse.<Boolean>builder()
                            .success(false)
                            .message("Thanh toán thất bại hoặc chữ ký không hợp lệ")
                            .data(false)
                            .build()
            );
        }
    }
}
