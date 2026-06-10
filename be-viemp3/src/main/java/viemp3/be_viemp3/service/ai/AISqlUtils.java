package viemp3.be_viemp3.service.ai;

public class AISqlUtils {

    public static boolean isSafeSelect(String sql) {

        if (sql == null) {
            return false;
        }

        String normalized = sql.trim().toLowerCase();

        return normalized.startsWith("select")
                && !normalized.contains("insert")
                && !normalized.contains("update")
                && !normalized.contains("delete")
                && !normalized.contains("drop")
                && !normalized.contains("alter")
                && !normalized.contains("truncate");
    }
}