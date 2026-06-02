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
    @Query("SELECT o.aPackage.pkg, o.aPackage.duration, COUNT(o) " +
            "FROM Order o " +
            "WHERE o.status = 'COMPLETED' " +
            "GROUP BY o.aPackage.pkg, o.aPackage.duration")

    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findAllByUserOrderByOrderDateDesc(User user);

    @Modifying
    @Transactional
    void deleteByIdAndStatus(String id, OrderStatus status);
}
