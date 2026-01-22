package com.example.smartexpenseanalyzerserver.config;

import com.google.genai.Chat;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatConfig {
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ToolCallbackProvider toolCallbackProvider) {
        return builder.defaultToolCallbacks(toolCallbackProvider.getToolCallbacks())
                .defaultSystem("You are a helpful financial assistant.")
                .build();
    }
}
