const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketio = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/chatMsg",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const messagesRouter = require("./routes/messages");
app.use("/messages", messagesRouter);

// Define socket.io event handlers
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  // Handle incoming messages from clients
  socket.on("sendMessage", ({ name, message }) => {
    // Emit the message to all connected clients
    io.emit("message", { name, message });
    console.log(`Message from ${name}: ${message}`);
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

// Start the server
const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
