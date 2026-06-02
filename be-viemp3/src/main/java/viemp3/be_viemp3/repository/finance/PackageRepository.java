package viemp3.be_viemp3.repository.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Packages;

@Repository
public interface PackageRepository extends JpaRepository<Packages, String> {
}
