// src/index.ts
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URI! as string, {
    dbName: process.env.MONGODB_DB_NAME,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
