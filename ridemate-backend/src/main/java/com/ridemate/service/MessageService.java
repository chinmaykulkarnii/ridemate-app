package com.ridemate.service;

import com.ridemate.model.Message;
import com.ridemate.model.User;
import com.ridemate.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userService.getUserById(senderId);
        User receiver = userService.getUserById(receiverId);

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Send real-time notification via WebSocket
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/messages",
                savedMessage
        );

        return savedMessage;
    }

    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }

    public List<Message> getUnreadMessages(Long userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId);
    }

    public Message markAsRead(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setIsRead(true);
        return messageRepository.save(message);
    }
}