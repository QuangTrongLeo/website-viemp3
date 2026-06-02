package viemp3.be_viemp3.controller.finance;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
