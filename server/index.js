
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

dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/projects", projectRoutes)
// app.use("/api/proposals", proposalRoutes);
app.use("/api/events", eventRoutes);
// app.use("/api/chat", chatRoutes);

const PORT= process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
