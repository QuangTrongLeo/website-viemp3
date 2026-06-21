package viemp3.be_viemp3.repository.finance;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Order;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.enums.OrderStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByVnpTxnRef(String vnpTxnRef);
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findAllByUserOrderByOrderDateDesc(User user);

    @Modifying
    @Transactional
    void deleteByIdAndStatus(String id, OrderStatus status);

    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED'")
    Double sumTotalRevenueByCompletedStatus();

    @Query("SELECT o.aPackage.pkg, o.aPackage.duration, COUNT(o) " +
            "FROM Order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY o.aPackage.pkg, o.aPackage.duration")
    List<Object[]> countOrdersByPackageGrouped();

    @Query(value = "SELECT MONTH(o.order_date) as month, SUM(o.total_price) as revenue " +
            "FROM orders o " +
            "WHERE o.status = 'COMPLETED' AND YEAR(o.order_date) = YEAR(CURRENT_DATE) " +
            "GROUP BY MONTH(o.order_date) " +
            "ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getMonthlyRevenueStats();

    long countByStatus(OrderStatus status);
}
