package viemp3.be_viemp3.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import viemp3.be_viemp3.entity.Genre;
import viemp3.be_viemp3.entity.Role;
import viemp3.be_viemp3.enums.GenreEnum;
import viemp3.be_viemp3.enums.RoleEnum;
import viemp3.be_viemp3.repository.auth.RoleRepository;
import viemp3.be_viemp3.repository.music.GenreRepository;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final GenreRepository genreRepository;
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // --- Khởi tạo genres ---
        for (GenreEnum genreEnum : GenreEnum.values()) {
            String name = genreEnum.name();
            if (!genreRepository.existsByNameIgnoreCase(name)) {
                Genre genre = new Genre();
                genre.setName(name);
                genreRepository.save(genre);
            }
        }

        // --- Khởi tạo roles ---
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (!roleRepository.existsByName(roleEnum)) {
                Role role = new Role();
                role.setName(roleEnum);
                roleRepository.save(role);
            }
        }
    }
}
