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

// MongoDB Connection - USE ENVIRONMENT VARIABLE
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/what";

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    console.log("✅ Using cached MongoDB connection");
    return cachedConnection;
  }

  try {
    mongoose.set("bufferCommands", false);
    
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB connected successfully");
    cachedConnection = mongoose.connection;
    
    cachedConnection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      cachedConnection = null;
    });
    
    cachedConnection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      cachedConnection = null;
    });
    
    return cachedConnection;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// Connect on startup for local development
if (!process.env.VERCEL) {
  connectDB();
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/chats");
});

app.get("/debug-chats", async (req, res) => {
  try {
    await connectDB();
    const chats = await Chat.find({});
    res.json({
      count: chats.length,
      sample: chats[0] ? chats[0].toObject() : null,
      connectionState: mongoose.connection.readyState,
      cached: !!cachedConnection,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/chats", async (req, res) => {
  try {
    console.log("📍 /chats route - Connecting to DB...");
    await connectDB();
    console.log("✅ Connected, fetching chats...");
    
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${chats.length} chats`);
    
    res.render("front", { chats });
  } catch (err) {
    console.error("❌ /chats error:", err.message);
    console.error("Stack:", err.stack);
    
    // Fallback for old field names
    try {
      await connectDB();
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
    await connectDB();
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
    console.log("✅ Chat saved:", newChat._id);
    res.redirect("/chats");
  } catch (err) {
    console.error("❌ POST /chats error:", err.message);
    res.status(500).send("Save failed: " + err.message);
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  try {
    await connectDB();
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send("Chat not found");
    res.render("edit", { chat });
  } catch (err) {
    res.status(500).send("Edit error: " + err.message);
  }
});

app.put("/chats/:id", async (req, res) => {
  try {
    await connectDB();
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
    await connectDB();
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Delete failed: " + err.message);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.message);
  res.status(500).send("Something broke! " + err.message);
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start server (Local Only)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("🚀 SERVER STARTED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ MongoDB connection state: ${mongoose.connection.readyState}`);
    console.log(`\n📋 Available routes:`);
    console.log(`   → Home:        http://localhost:${PORT}/`);
    console.log(`   → Chats:       http://localhost:${PORT}/chats`);
    console.log(`   → Debug:       http://localhost:${PORT}/debug-chats`);
    console.log(`   → New Chat:    http://localhost:${PORT}/chats/new`);
    console.log("=".repeat(50) + "\n");
  }).on('error', (err) => {
    console.error("❌ Server failed to start:", err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(`⚠️  Port ${PORT} is already in use!`);
      console.error(`💡 Try: PORT=3000 node index.js`);
    }
    process.exit(1);
  });
}

// Export for Vercel
module.exports = app;