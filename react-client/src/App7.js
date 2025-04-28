//Updated App.js to Add Timestamps
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userData, setUserData] = useState({ username: '', avatarStyle: '' });
  const [typingStatus, setTypingStatus] = useState('');

  const avatarStyles = [
    'croodles',
    'croodles-neutral',
    'avataaars',
    'bottts',
    'pixel-art',
    'fun-emoji',
    'identicon',
  ];

  const getRandomStyle = () => {
    const randomIndex = Math.floor(Math.random() * avatarStyles.length);
    return avatarStyles[randomIndex];
  };

  useEffect(() => {
    const randomName = `User-${Math.floor(Math.random() * 1000)}`;
    const style = getRandomStyle();
    setUserData({ username: randomName, avatarStyle: style });
  }, []);

  useEffect(() => {
    socketRef.current = io('http://localhost:9013');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message', (messageObj) => {
      setMessages((prevMessages) => [...prevMessages, messageObj]);
    });

    socketRef.current.on('typing', (typingUser) => {
      if (typingUser !== userData.username) {
        setTypingStatus(`${typingUser} is typing...`);
        setTimeout(() => setTypingStatus(''), 2000);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userData.username]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const messageObj = {
        id: uuidv4(),
        user: userData.username,
        text: newMessage,
        avatarStyle: userData.avatarStyle,
        timestamp: timestamp,
      };
      socketRef.current.emit('message', messageObj);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', userData.username);
  };

  const getAvatarUrl = (user, style) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(user)}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💬 Fun Chat App</h1>
      <div style={{ marginBottom: '0.5rem', color: '#555' }}>
        You are: <strong>{userData.username}</strong> using <em>{userData.avatarStyle}</em> style!
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => {
          const isOwnMessage = msg.user === userData.username;
          return (
            <div
              key={idx}
              style={{
                ...styles.messageContainer,
                flexDirection: isOwnMessage ? 'row-reverse' : 'row',
              }}
            >
              <img
                src={getAvatarUrl(msg.user, msg.avatarStyle)}
                alt="avatar"
                style={styles.avatar}
              />
              <div
                style={{
                  ...styles.message,
                  backgroundColor: isOwnMessage ? '#dcf8c6' : '#e6f7ff',
                }}
              >
                <div style={styles.username}>{msg.user}</div>
                <div>{msg.text}</div>
                <div style={styles.timestamp}>{msg.timestamp}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {typingStatus && (
        <div style={styles.typingStatus}>{typingStatus}</div>
      )}

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '1rem',
  },
  header: {
    marginBottom: '0.5rem',
    color: '#333',
  },
  chatBox: {
    width: '100%',
    maxWidth: '500px',
    height: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    overflowY: 'scroll',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '0.5rem',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    margin: '0 0.5rem',
    borderRadius: '50%',
  },
  message: {
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    maxWidth: '70%',
    wordBreak: 'break-word',
    position: 'relative',
  },
  username: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '0.25rem',
  },
  timestamp: {
    fontSize: '0.7rem',
    color: '#999',
    marginTop: '0.25rem',
    textAlign: 'right',
  },
  typingStatus: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '0.5rem',
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '8px 0 0 8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0 8px 8px 0',
    border: 'none',
    backgroundColor: '#1890ff',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
  }
};

export default App;
