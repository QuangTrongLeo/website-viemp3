package be_viemp3.viemp3.service.ai;

public class AISqlUtils {
    public static boolean isSafeSelect(String sql) {
        String normalized = sql.trim().toLowerCase();

        return normalized.startsWith("select")
                && !normalized.contains("delete")
                && !normalized.contains("update")
                && !normalized.contains("insert")
                && !normalized.contains("drop");
    }
}
