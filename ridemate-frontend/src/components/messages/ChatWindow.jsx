import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import { websocketService } from '../../services/websocketService';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ otherUser, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [otherUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const data = await messageService.getConversation(otherUser.id);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    websocketService.subscribeToMessages(user.id, (message) => {
      if (message.sender.id === otherUser.id || message.receiver.id === otherUser.id) {
        setMessages(prev => [...prev, message]);
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    websocketService.sendMessage(user.id, otherUser.id, newMessage);

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: user,
      receiver: otherUser,
      content: newMessage,
      createdAt: new Date().toISOString()
    }]);

    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <img
            src={otherUser.profilePicture || '/default-avatar.png'}
            alt={otherUser.firstName}
          />
          <span>{otherUser.firstName} {otherUser.lastName}</span>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender.id === user.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;