package viemp3.be_viemp3.service.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import viemp3.be_viemp3.dto.request.ai.ChatRequest;
import viemp3.be_viemp3.entity.User;
import viemp3.be_viemp3.service.auth.SecurityService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatAIService {

    private final ChatClient chatClient;
    private final JdbcTemplate jdbcTemplate;
    private final SecurityService securityService;

    public ChatAIService(ChatClient.Builder builder, JdbcTemplate jdbcTemplate, SecurityService securityService) {
        this.jdbcTemplate = jdbcTemplate;
        this.securityService = securityService;
        ChatMemory chatMemory = MessageWindowChatMemory.builder()
                .maxMessages(50)
                .build();
        this.chatClient = builder.defaultAdvisors(
                        MessageChatMemoryAdvisor
                                .builder(chatMemory)
                                .build())
                .build();
    }

    public Object chatAI(ChatRequest request) {
        User user = securityService.getCurrentUser();
        String question = request.getMessage();
        String conversationId = user.getId();
        String sql = generateSql(question, conversationId);
        if (!AISqlUtils.isSafeSelect(sql)) {
            return Map.of("text", sql);
        }
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            return buildResponse(question, rows, conversationId);
        } catch (Exception e) {
            return Map.of("text", "Không thể truy vấn dữ liệu.");
        }
    }

    private String generateSql(String question, String conversationId) {
        return chatClient.prompt()
                .system(AIConstant.DB_SCHEMA)
                .user(question)
                .advisors(a ->
                        a.param(ChatMemory.CONVERSATION_ID, conversationId)
                )
                .call()
                .content();
    }

    private String generateText(String question, List<Map<String, Object>> data, String conversationId) {
        return chatClient.prompt()
                .system(AIConstant.TEXT_PROMPT
                                .replace("{question}", question)
                                .replace("{data}", data.toString())
                )
                .user(question)
                .advisors(a ->
                        a.param(ChatMemory.CONVERSATION_ID, conversationId)
                )
                .call()
                .content();
    }

    private Object buildResponse(String question, List<Map<String, Object>> data, String conversationId) {
        if (data.isEmpty()) {
            return Map.of("text", "Không tìm thấy dữ liệu phù hợp.");
        }
        String text = generateText(question, data, conversationId);
        String lower = question.toLowerCase();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("text", text);
        if (lower.contains("bài hát")) {
            result.put("songs", data);
            return result;
        }

        if (lower.contains("album")) {
            result.put("albums", data);
            return result;
        }

        if (lower.contains("nghệ sĩ") || lower.contains("ca sĩ")) {
            result.put("artists", data);
            return result;
        }

        if (lower.contains("thể loại")) {
            result.put("genres", data);
            return result;
        }

        return result;
    }
}