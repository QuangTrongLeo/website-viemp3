package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UuidGenerator;
import viemp3.be_viemp3.enums.OrderStatus;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue
    @UuidGenerator
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private Packages aPackage;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Voucher voucher;

    private Double totalPrice; // Số tiền cuối cùng sau khi giảm giá
    private LocalDateTime orderDate;
    private LocalDateTime expiryDate; // Ngày hết hạn Premium dự kiến

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // PENDING, COMPLETED, FAILED

    private String vnpTxnRef;
}

