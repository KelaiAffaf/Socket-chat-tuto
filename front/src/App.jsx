import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the server using Socket.IO
const socket = io("http://localhost:9000");

// Inline styles for the application
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "300px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  messagesList: {
    width: "300px",
    listStyleType: "none",
    padding: "0",
    marginTop: "20px",
  },
  messageItem: {
    padding: "10px",
    color: "black",
    borderBottom: "1px solid #ccc",
  },
};

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Use effect to join a room and listen for incoming messages
  useEffect(() => {
    // Join the chat room
    const room = "chatRoom1";
    socket.emit("joinRoom", room);

    // Listen for the "message" event from the server
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("message");
    };
  }, []);

  // Handle the form submission to send a message
  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure that both name and message are provided
    if (name.trim() && message.trim()) {
      // Send the message and name to the server, and include the room
      socket.emit("sendMessage", { name, message, room: "chatRoom1" });

      // Reset the form inputs
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={{ color: "black" }}>Chat App</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={name}
          placeholder="Your name"
          onChange={(event) => setName(event.target.value)}
          style={styles.input}
          required
        />
        <input
          type="text"
          value={message}
          placeholder="Your message"
          onChange={(event) => setMessage(event.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>

      {/* Display the list of messages */}
      <ul style={styles.messagesList}>
        {messages.map((msg, index) => (
          <li key={index} style={styles.messageItem}>
            <strong>{msg.name}</strong>: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
