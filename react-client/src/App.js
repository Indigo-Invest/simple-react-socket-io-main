//update App3.js with "Usernames", "Auto-scroll", Cool "sent" and "received" message styles
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'; // unique id for users

function App() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  // Set a random username when app starts
  useEffect(() => {
    const randomName = `User-${Math.floor(Math.random() * 1000)}`;
    setUsername(randomName);
  }, []);

  useEffect(() => {
    socketRef.current = io('http://localhost:9013');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message', (messageObj) => {
      setMessages((prevMessages) => [...prevMessages, messageObj]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to the latest message
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      const messageObj = {
        id: uuidv4(),
        user: username,
        text: newMessage,
      };
      socketRef.current.emit('message', messageObj);
      setNewMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💬 Simple Chat App</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.user === username ? 'flex-end' : 'flex-start',
              backgroundColor: msg.user === username ? '#dcf8c6' : '#e6f7ff',
            }}
          >
            <div style={styles.username}>{msg.user}</div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
    marginBottom: '1rem',
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
    marginBottom: '1rem',
  },
  message: {
    padding: '0.5rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '10px',
    maxWidth: '70%',
    wordBreak: 'break-word',
  },
  username: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '0.25rem',
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
