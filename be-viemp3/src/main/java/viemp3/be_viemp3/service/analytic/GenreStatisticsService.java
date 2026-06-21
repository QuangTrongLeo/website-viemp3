package viemp3.be_viemp3.service.analytic;

import viemp3.be_viemp3.dto.response.analytics.GenreStatisticsResponse;
import viemp3.be_viemp3.repository.music.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GenreStatisticsService {
    private final SongRepository songRepository;

    public List<GenreStatisticsResponse> getGenreStatistics() {
        long totalSongs = songRepository.count();
        List<Object[]> results = songRepository.countSongsByGenre();
        return results.stream().map(result -> {
            String genreName = (String) result[0];
            long count = (long) result[1];
            double percentage = (totalSongs > 0) ? ((double) count / totalSongs) * 100 : 0;
            percentage = Math.round(percentage * 100.0) / 100.0;
            return new GenreStatisticsResponse(genreName, count, percentage);
        }).collect(Collectors.toList());
    }
}
