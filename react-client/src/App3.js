import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socketRef.current = io('http://localhost:9013');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      socketRef.current.emit('message', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💬 Simple Chat App</h1>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} style={styles.message}>
            {msg}
          </div>
        ))}
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
    marginBottom: '1rem',
  },
  message: {
    padding: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: '#e6f7ff',
    borderRadius: '6px',
    wordBreak: 'break-word',
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
