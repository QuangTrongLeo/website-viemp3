package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vouchers")
public class Voucher {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private Integer quantity; // Số lượng còn lại trong kho

    @Column(nullable = false)
    private Double discountPercentage; // Ví dụ: 10.0 (giảm 10%)

    @Column(nullable = false)
    private Double maxDiscountAmount; // Giới hạn số tiền giảm (Ví dụ: Giảm 10% nhưng tối đa 50k)

    @Column(nullable = false)
    private LocalDateTime startDate; // Ngày bắt đầu hiệu lực

    @Column(nullable = false)
    private LocalDateTime endDate; // Ngày hết hạn

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    private boolean active = false;
}