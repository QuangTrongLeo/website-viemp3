package viemp3.be_viemp3.dto.request.music.genre;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenreRequest {
    @NotNull(message = "Tên genre không được để trống")
    private String name;
}