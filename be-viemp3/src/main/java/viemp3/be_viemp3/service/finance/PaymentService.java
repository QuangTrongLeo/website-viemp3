package viemp3.be_viemp3.service.finance;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import viemp3.be_viemp3.common.service.EntityQueryService;
import viemp3.be_viemp3.config.VNPayConfig;
import viemp3.be_viemp3.entity.Order;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final EntityQueryService entityService;
    private final OrderService orderService;
    private final VNPayConfig vnPayConfig;
    private final VNPayService vnPayService;

    public String createPaymentUrl(String orderId, HttpServletRequest httpRequest) {
        Order order = entityService.findOrderById(orderId);
        long amount = (long) (order.getTotalPrice() * 100);
        String vnp_TxnRef = order.getVnpTxnRef();
        String vnp_IpAddr = vnPayConfig.getIpAddress(httpRequest);
        return vnPayService.buildPaymentUrl(order.getId(), amount, vnp_TxnRef, vnp_IpAddr);
    }

    @Transactional
    public boolean processPaymentCallback(Map<String, String> params) {
        // 1. Verify chữ ký
        if (!vnPayService.verifyCallback(params)) {
            return false;
        }
        // 2. Lấy thông tin cơ bản
        String responseCode = params.get("vnp_ResponseCode");
        String txnRef = params.get("vnp_TxnRef");

        if ("00".equals(responseCode)) {
            orderService.completeOrder(txnRef);
            return true;
        } else {
            orderService.failOrder(txnRef);
            return false;
        }
    }
}
