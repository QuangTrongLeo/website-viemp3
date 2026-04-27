package viemp3.be_viemp3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.data.annotation.CreatedDate;
import viemp3.be_viemp3.enums.DurationType;
import viemp3.be_viemp3.enums.PackageType;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "packages")
public class Packages {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private String id;

    @Enumerated(EnumType.STRING)
    private PackageType pkg; // INDIVIDUAL hoặc STUDENT

    @Enumerated(EnumType.STRING)
    private DurationType duration; // ONE_MONTH, THREE_MONTHS, SIX_MONTHS

    private Double basePrice;      // Giá gốc 1 tháng (ví dụ: 20000)
    private Double discountPercent; // % Giảm giá
    private Double finalPrice;     // Tổng số tiền người dùng phải trả

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
