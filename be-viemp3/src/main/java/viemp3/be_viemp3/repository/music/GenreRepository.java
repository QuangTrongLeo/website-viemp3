package viemp3.be_viemp3.repository.music;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import viemp3.be_viemp3.entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, String> {
    boolean existsByNameIgnoreCase(String name);
}
