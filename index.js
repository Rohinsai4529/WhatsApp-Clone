



// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const Chat = require("./models/chat");

// const app = express();

// // View engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // Middleware
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));

// // Connect to MongoDB
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/what";

// async function connectDB() {
//   try {
//     await mongoose.connect(MONGO_URI);
//   } catch (err) {
//     console.error("Database connection error:", err);
//     process.exit(1);
//   }
// }

// // Routes
// app.get("/", (req, res) => {
//   res.redirect("/chats");
// });

// app.get("/chats", async (req, res) => {
//   try {
//     const chats = await Chat.find({}).sort({ createdAt: -1 });
//     res.render("front", { chats });
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// });

// app.get("/chats/new", (req, res) => {
//   res.render("new");
// });

// app.post("/chats", async (req, res) => {
//   try {
//     const { from, to, msg } = req.body;
//     const newChat = new Chat({
//       from,
//       to,
//       msg,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     });
//     await newChat.save();
//     res.redirect("/chats");
//   } catch (err) {
//     res.status(500).send("Error saving chat");
//   }
// });

// app.get("/chats/:id/edit", async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) return res.status(404).send("Chat not found");
//     res.render("edit", { chat });
//   } catch (err) {
//     res.status(500).send("Server Error");
//   }
// });

// app.put("/chats/:id", async (req, res) => {
//   try {
//     const { msg } = req.body;
//     const updatedChat = await Chat.findByIdAndUpdate(
//       req.params.id,
//       { msg, updatedAt: new Date() },
//       { runValidators: true, new: true }
//     );
//     if (!updatedChat) return res.status(404).send("Chat not found");
//     res.redirect("/chats");
//   } catch (err) {
//     res.status(500).send("Update failed");
//   }
// });

// app.delete("/chats/:id", async (req, res) => {
//   try {
//     const deleted = await Chat.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).send("Chat not found");
//     res.redirect("/chats");
//   } catch (err) {
//     res.status(500).send("Delete failed");
//   }
// });

// // Start server
// if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
//   connectDB().then(() => {
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//       console.log(`App is listening on port ${PORT}`);
//     });
//   });
// }

// module.exports = app;






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
    await mongoose.connect(MONGO_URI);
    console.log("Database connection success");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

// Connect to database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.redirect("/chats");
});

app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find({}).sort({ createdAt: -1 });
    res.render("front", { chats });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get("/chats/new", (req, res) => {
  res.render("new");
});

app.post("/chats", async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    const newChat = new Chat({
      from,
      to,
      msg,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Error saving chat");
  }
});

app.get("/chats/:id/edit", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send("Chat not found");
    res.render("edit", { chat });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.put("/chats/:id", async (req, res) => {
  try {
    const { msg } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { msg, updatedAt: new Date() },
      { runValidators: true, new: true }
    );
    if (!updatedChat) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Update failed");
  }
});

app.delete("/chats/:id", async (req, res) => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Chat not found");
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// Export for Vercel
module.exports = app;