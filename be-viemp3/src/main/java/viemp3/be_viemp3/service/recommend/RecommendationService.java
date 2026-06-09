package viemp3.be_viemp3.service.recommend;

import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.entity.ListenHistory;
import viemp3.be_viemp3.entity.Song;
import viemp3.be_viemp3.repository.music.ListenHistoryRepository;
import viemp3.be_viemp3.repository.music.SongRepository;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ListenHistoryRepository listenHistoryRepository;
    private final SongRepository songRepository;

    // ===== CONSTANTS =====
    private static final double GENRE_WEIGHT = 0.5;
    private static final double ARTIST_WEIGHT = 0.3;
    private static final double ALBUM_WEIGHT = 0.2;

    private static final double RECENT_WEIGHT_DECAY = 7.0;
    private static final double LISTENED_PENALTY = 0.7;

    // ===== MAIN =====
    public List<Song> recommend(String userId) {
        List<ListenHistory> histories = listenHistoryRepository.findByUserId(userId);
        List<Song> allSongs = songRepository.findAll();

        if (allSongs.isEmpty()) return List.of();

        // ===== index =====
        Map<String, Integer> genreIndex = buildGenreIndex(allSongs);
        Map<String, Integer> artistIndex = buildArtistIndex(allSongs);
        Map<String, Integer> albumIndex = buildAlbumIndex(allSongs);

        // ===== user vector =====
        double[] userVector = buildUserVector(histories, genreIndex, artistIndex, albumIndex);
        Map<String, double[]> songVectorMap = allSongs.stream()
                .collect(Collectors.toMap(
                        Song::getId,
                        song -> buildSongVector(song, genreIndex, artistIndex, albumIndex)
                ));

        Set<String> listenedIds = histories.stream()
                .map(h -> h.getSong().getId())
                .collect(Collectors.toSet());

        return allSongs.stream()
                .sorted((a, b) -> Double.compare(
                        score(b, userVector, songVectorMap.get(b.getId()), listenedIds),
                        score(a, userVector, songVectorMap.get(a.getId()), listenedIds)
                ))
                .limit(10)
                .toList();
    }

    // ===== SCORE =====
    private double score(
            Song song,
            double[] userVector,
            double[] songVector,
            Set<String> listenedIds
    ) {
        double similarity = cosineSimilarity(userVector, songVector);
        if (listenedIds.contains(song.getId())) {
            similarity *= LISTENED_PENALTY;
        }
        return similarity;
    }

    // ===== USER VECTOR =====
    private double[] buildUserVector(
            List<ListenHistory> histories,
            Map<String, Integer> genreIndex,
            Map<String, Integer> artistIndex,
            Map<String, Integer> albumIndex
    ) {
        int size = genreIndex.size() + artistIndex.size() + albumIndex.size() + 2;
        double[] userVector = new double[size];

        OffsetDateTime now = OffsetDateTime.now();

        for (ListenHistory lh : histories) {
            double[] songVector = buildSongVector(lh.getSong(), genreIndex, artistIndex, albumIndex);

            long days = ChronoUnit.DAYS.between(lh.getListenedAt(), now);
            double weight = Math.exp(-days / RECENT_WEIGHT_DECAY);

            for (int i = 0; i < size; i++) {
                userVector[i] += songVector[i] * weight;
            }
        }

        return normalizeVector(userVector);
    }

    // ===== SONG VECTOR =====
    private double[] buildSongVector(
            Song song,
            Map<String, Integer> genreIndex,
            Map<String, Integer> artistIndex,
            Map<String, Integer> albumIndex
    ) {
        int baseSize = genreIndex.size() + artistIndex.size() + albumIndex.size();
        int size = baseSize + 2;

        double[] vector = new double[size];

        // ===== categorical =====
        if (song.getGenre() != null) {
            vector[genreIndex.get(song.getGenre().getId())] = GENRE_WEIGHT;
        }

        if (song.getArtist() != null) {
            vector[artistIndex.get(song.getArtist().getId()) + genreIndex.size()] = ARTIST_WEIGHT;
        }

        if (song.getAlbum() != null) {
            vector[albumIndex.get(song.getAlbum().getId())
                    + genreIndex.size()
                    + artistIndex.size()] = ALBUM_WEIGHT;
        }

        // ===== numeric =====
        vector[baseSize] = normalizeValue(song.getFavorites());
        vector[baseSize + 1] = normalizeValue(song.getListenCount());

        return vector;
    }

    // ===== COSINE =====
    private double cosineSimilarity(double[] a, double[] b) {
        RealVector v1 = new ArrayRealVector(a);
        RealVector v2 = new ArrayRealVector(b);

        double dot = v1.dotProduct(v2);
        double normA = v1.getNorm();
        double normB = v2.getNorm();

        if (normA == 0 || normB == 0) return 0;

        return dot / (normA * normB);
    }

    // ===== NORMALIZE VECTOR =====
    private double[] normalizeVector(double[] vector) {
        double sum = 0;
        for (double v : vector) sum += v * v;

        double norm = Math.sqrt(sum);
        if (norm == 0) return vector;

        for (int i = 0; i < vector.length; i++) {
            vector[i] /= norm;
        }

        return vector;
    }

    // ===== NORMALIZE VALUE =====
    private double normalizeValue(long value) {
        return Math.log(1 + value);
    }

    // ===== INDEX =====
    private Map<String, Integer> buildGenreIndex(List<Song> songs) {
        return buildIndex(songs.stream()
                .map(Song::getGenre)
                .filter(Objects::nonNull)
                .map(g -> g.getId())
                .toList());
    }

    private Map<String, Integer> buildArtistIndex(List<Song> songs) {
        return buildIndex(songs.stream()
                .map(Song::getArtist)
                .filter(Objects::nonNull)
                .map(a -> a.getId())
                .toList());
    }

    private Map<String, Integer> buildAlbumIndex(List<Song> songs) {
        return buildIndex(songs.stream()
                .map(Song::getAlbum)
                .filter(Objects::nonNull)
                .map(a -> a.getId())
                .toList());
    }

    private Map<String, Integer> buildIndex(List<String> ids) {
        Map<String, Integer> map = new HashMap<>();
        int i = 0;
        for (String id : ids) {
            if (!map.containsKey(id)) {
                map.put(id, i++);
            }
        }
        return map;
    }
}
