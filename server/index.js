const http=require("http")
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB= require("./db/connectDB.js")
const userRoutes = require("./routes/userRoutes.js");
const gigRoutes = require("./routes/gigRoutes");
// const proposalRoutes = require("./routes/proposalRoutes");
const eventRoutes = require("./routes/eventRoutes");
// const chatRoutes = require("./routes/chatRoutes");
const projectRoutes= require("./routes/projectRoutes.js")
const { Server } = require('socket.io');
const groupRoutes= require("./routes/groupRoutes.js")
const proposalRoutes = require("./routes/proposalRoutes");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
require('./socket.js')(io);
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/proposals", proposalRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/projects", projectRoutes)
// app.use("/api/proposals", proposalRoutes);
app.use("/api/events", eventRoutes);
// app.use("/api/chat", chatRoutes);
app.use("/api/groups", groupRoutes)

const PORT= process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
