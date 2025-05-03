//Replaced depricated methods 
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);

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

  const handleSendMessage = () => {
    const timeMessage = `Message sent at: ${new Date().toLocaleTimeString()}`;
    socketRef.current.emit('message', timeMessage);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple React + Socket.IO Chat</h1>
      <button onClick={handleSendMessage} style={{ marginBottom: '1rem' }}>
        Send Current Time
      </button>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ padding: '0.5rem 0' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
