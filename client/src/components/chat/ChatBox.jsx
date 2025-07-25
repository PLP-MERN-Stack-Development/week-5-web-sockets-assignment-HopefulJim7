import { useState, useEffect } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import socket from '../../utils/socket';

export default function ChatBox({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);

  useEffect(() => {
    // Join chat and load recent messages
    socket.emit('join', { username });

    socket.on('loadMessages', recent => {
      const formatted = recent.map(msg => ({
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp,
      }));
      setMessages(formatted);
    });

    socket.on('message', ({ sender, text }) => {
      setMessages(prev => [...prev, { sender, text }]);
    });

    socket.on('userTyping', ({ username: typingUser }) => {
      if (typingUser !== username) {
        setUsersTyping(prev => [...new Set([...prev, typingUser])]);
      }
    });

    socket.on('userStopTyping', ({ username: stopUser }) => {
      setUsersTyping(prev => prev.filter(user => user !== stopUser));
    });

    return () => {
      socket.off('loadMessages');
      socket.off('message');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [username]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    socket.emit('message', { sender: username, text: trimmed });
    setMessages(prev => [...prev, { sender: username, text: trimmed }]);
    setInput('');
    socket.emit('stopTyping', { username });
  };

  const handleInputChange = e => {
    setInput(e.target.value);
    socket.emit('typing', { username });

    setTimeout(() => {
      socket.emit('stopTyping', { username });
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 rounded-lg shadow bg-background">
      <div className="space-y-2 mb-2 h-64 overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageItem
            key={index}
            message={msg.text}
            isUser={msg.sender === username}
          />
        ))}
        {usersTyping.map((u, index) => (
          <TypingIndicator key={index} username={u} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Type a message…"
          value={input}
          onChange={handleInputChange}
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-3 py-2 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}