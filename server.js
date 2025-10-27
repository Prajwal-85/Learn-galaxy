// server.js — Learn Galaxy backend

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs-extra";

const app = express();
const PORT = process.env.PORT || 3000;
const STORIES_FILE = "./data/stories.json";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".")); // serves your HTML files

// Ensure data folder and file exist
await fs.ensureFile(STORIES_FILE);
const initData = await fs.readFile(STORIES_FILE, "utf8");
if (!initData) await fs.writeFile(STORIES_FILE, "[]");

// ✅ GET all stories
app.get("/api/stories", async (req, res) => {
  try {
    const stories = JSON.parse(await fs.readFile(STORIES_FILE, "utf8"));
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: "Failed to read stories." });
  }
});

// ✅ POST a new story
app.post("/api/stories", async (req, res) => {
  const { name, title, content } = req.body;

  if (!name || !title || !content) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const stories = JSON.parse(await fs.readFile(STORIES_FILE, "utf8"));
  const newStory = {
    id: Date.now(),
    name,
    title,
    content,
    date: new Date().toLocaleString()
  };

  stories.push(newStory);
  await fs.writeFile(STORIES_FILE, JSON.stringify(stories, null, 2));

  res.json({ message: "✅ Story added successfully!", story: newStory });
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🌌 Learn Galaxy Backend is running!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
