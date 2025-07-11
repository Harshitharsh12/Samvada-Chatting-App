import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import messaageRoute from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import "colors";
import { app, server } from "./Socket/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
db();

const port = process.env.PORT;
const mode = process.env.MODE;

console.log(`🚀 Server running in MODE: ${mode}`);

app.use(express.json());
app.use(morgan("dev"));

const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOption));
app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log(`[REQ] ${req.method} ${req.url}`);
//   next();
// });

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messaageRoute);

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files ONLY in production
// Serve frontend static files
app.use(express.static(path.join(__dirname, "./client/dist")));

// Catch-all route for SPA
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

server.listen(port, () => {
  console.log(
    `✅ Server Running Successfully in ${mode} mode on port ${port}!`.bgGreen
      .white
  );
});
