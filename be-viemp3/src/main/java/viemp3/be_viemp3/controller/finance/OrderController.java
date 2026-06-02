package viemp3.be_viemp3.controller.finance;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import viemp3.be_viemp3.common.response.ApiResponse;
import viemp3.be_viemp3.dto.request.finance.OrderRequest;
import viemp3.be_viemp3.dto.response.finance.OrderResponse;
import viemp3.be_viemp3.service.finance.OrderService;

import java.util.List;

@RestController
@RequestMapping("${api.vie-mp3-url}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('ADMIN','MOD','USER')")
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);

        return ResponseEntity.ok(
                ApiResponse.<OrderResponse>builder()
                        .success(true)
                        .message("Đã khởi tạo đơn hàng thành công")
                        .data(response)
                        .build()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> response = orderService.getAllOrders();
        return ResponseEntity.ok(
                ApiResponse.<List<OrderResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách tất cả đơn hàng thành công")
                        .data(response)
                        .build()
        );
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'MOD')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
        List<OrderResponse> response = orderService.getAllOrdersByUser();
        return ResponseEntity.ok(
                ApiResponse.<List<OrderResponse>>builder()
                        .success(true)
                        .message("Lấy danh sách đơn hàng của bạn thành công")
                        .data(response)
                        .build()
        );
    }
}
