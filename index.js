const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Chat = require("./models/chat");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/what";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Database connected successfully");
    return true;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    return false;
  }
}

// Connect on startup
connectDB();

// Routes
app.get("/", (req, res) => {
  res.redirect("/chats");
});

app.get("/debug-chats", async (req, res) => {
  try {
    const chats = await Chat.find({});
    res.json({
      count: chats.length,
      sample: chats[0] ? chats[0].toObject() : null,
      connectionState: mongoose.connection.readyState,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/chats", async (req, res) => {
  try {
    // Reconnect if needed
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("front", { chats });
  } catch (err) {
    console.error("❌ /chats error:", err.message);
    // Fallback for old field names
    try {
      const chats = await Chat.find({}).sort({ create: -1 });
      res.render("front", { chats });
    } catch (fallbackErr) {
      res.status(500).send("Database error: " + err.message);
    }
  }
});

app.get("/chats/new", (req, res) => {
  res.render("new");
});

app.post("/chats", async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    if (!from || !to || !msg) {
      return res.status(400).send("All fields required");
    }

    const newChat = new Chat({
      from: from.trim(),
      to: to.trim(),
      msg: msg.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    console.error("❌ POST /chats error:", err.message);
    res.status(500).send("Save failed: " + err.message);
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send("Chat not found");
    res.render("edit", { chat });
  } catch (err) {
    res.status(500).send("Edit error: " + err.message);
  }
});

app.put("/chats/:id", async (req, res) => {
  try {
    const { msg } = req.body;
    const updated = await Chat.findByIdAndUpdate(
      req.params.id,
      { msg: msg.trim(), updatedAt: new Date() },
      { runValidators: true, new: true }
    );
    if (!updated) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Update failed: " + err.message);
  }
});

app.delete("/chats/:id", async (req, res) => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Delete failed: " + err.message);
  }
});

// ONLY start server locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(`   → View chats: http://localhost:${PORT}/chats`);
    console.log(`   → Debug info: http://localhost:${PORT}/debug-chats`);
  });
}

// Export for Vercel
module.exports = app;