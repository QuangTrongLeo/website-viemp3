package be_viemp3.viemp3.service.ai;

import be_viemp3.viemp3.service.auth.SecurityService;
import be_viemp3.viemp3.dto.request.ai.ChatRequest;
import be_viemp3.viemp3.entity.User;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChatAIService {
    private final ChatClient chatClient;
    private final JdbcTemplate jdbcTemplate;
    private final SecurityService securityUtils;

    public ChatAIService(ChatClient.Builder builder, JdbcTemplate jdbcTemplate, SecurityService securityUtils) {
        this.jdbcTemplate = jdbcTemplate;
        this.securityUtils = securityUtils;

        // 1. Khởi tạo bộ nhớ hội thoại
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(50)
                .build();

        // 2. Build ChatClient với đầy đủ Advisors mặc định
        this.chatClient = builder
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    public String chatAI(ChatRequest request) {
        User user = securityUtils.getCurrentUser();
        String question = request.getMessage();

        String conversationId = user.getId();

        // 1. Generate SQL
        String sql = generateSql(question, conversationId);

        // 2. Nếu không phải SQL → trả luôn
        if (!AISqlUtils.isSafeSelect(sql)) {
            return sql;
        }

        try {
            // 3. Execute SQL
            List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);

            // 4. Format answer
            return formatAnswer(question, data, conversationId);

        } catch (Exception e) {
            return "Không thể truy vấn dữ liệu: " + e.getMessage();
        }
    }

    private String generateSql(String question, String conversationId) {
        return chatClient.prompt()
                .system(AIConstant.DB_SCHEMA)
                .user(question)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }

    private String formatAnswer(String question, List<Map<String, Object>> data, String conversationId) {
        return chatClient.prompt()
                .system("Dựa trên dữ liệu sau, hãy trả lời người dùng: " + data)
                .user(question)
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();
    }
}