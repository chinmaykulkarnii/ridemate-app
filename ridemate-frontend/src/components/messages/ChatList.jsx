import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatList = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations] = useState([]);

  // In a real app, you'd load conversations from the backend
  // For now, this is a placeholder

  return (
    <div className="chat-container">
      <h2>Messages</h2>

      {conversations.length === 0 ? (
        <div className="empty-state">
          <p>No conversations yet.</p>
          <p>Start chatting with drivers or passengers from your bookings!</p>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className="conversation-item"
              onClick={() => setSelectedUser(conv.otherUser)}
            >
              <img src={conv.otherUser.profilePicture || '/default-avatar.png'} alt="" />
              <div>
                <h4>{conv.otherUser.firstName} {conv.otherUser.lastName}</h4>
                <p>{conv.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <ChatWindow
          otherUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ChatList;