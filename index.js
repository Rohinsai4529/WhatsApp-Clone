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

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/what";

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    cachedConnection = mongoose.connection;
    
    cachedConnection.on('error', (err) => {
      cachedConnection = null;
    });
    
    cachedConnection.on('disconnected', () => {
      cachedConnection = null;
    });
    
    return cachedConnection;
  } catch (err) {
    throw err;
  }
}

if (!process.env.VERCEL) {
  connectDB().catch(err => {});
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
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/chats", async (req, res) => {
  try {
    await connectDB();
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("front", { chats });
  } catch (err) {
    try {
      await connectDB();
      const chats = await Chat.find({}).sort({ create: -1 });
      res.render("front", { chats });
    } catch (fallbackErr) {
      res.status(500).send("Database error");
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
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Save failed");
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  try {
    await connectDB();
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send("Chat not found");
    res.render("edit", { chat });
  } catch (err) {
    res.status(500).send("Edit error");
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
    res.status(500).send("Update failed");
  }
});

app.delete("/chats/:id", async (req, res) => {
  try {
    await connectDB();
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start server (Local Only)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8080;
  
  connectDB().then(() => {
    app.listen(PORT, () => {});
  }).catch(err => {
    process.exit(1);
  });
}

module.exports = app;