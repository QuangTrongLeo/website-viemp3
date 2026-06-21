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

    long countByStatus(OrderStatus status);
}
