// const express = require ("express");
// const app =  express ()

// const mongoose = require('mongoose');
// const path = require ("path");
// const Chat = require("./models/chat.js")
// const methodOverride = require ("method-override");
// app.set("views",path.join(__dirname,"views"));
// app.set("view engine","ejs");
// app.use(express.static(path.join(__dirname,"public")));
// app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("_method"));

// main()
// .then(()=>{
//     console.log("connection sucess");
// }).catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/what');

// }
// app.get("/",(req,res)=>{
//     res.send("working properly");
// });


// app.get("/chats", async (req,res)=>{
//     let chats = await Chat.find({});
// console.log(chats);
// res.render("index.ejs",{chats});
// });
// app.get("/chats/:id/edit", async(req,res)=>{
//     let {id} = req.params;
//    let chat =  await Chat.findById(id);
//    res.render("edit.ejs",{chat})
// });
// // app.get("/chats", async (req,res)=>{
// //     let chats = await Chat.find({});
// // console.log(chats);
// // res.render("front.ejs",{chats});
// // });
// app.get("/chats/new",(req,res)=>{
//     res.render("new.ejs");
// });
// app.post("/chats",(req,res)=>{
//     let {from,to,msg} = req.body;
//    let newChat = new Chat({
//     from:from,
//     to:to,
//     msg:msg,
//     create:new Date (),
//     updatedate:new Date ()
//    });
//    newChat.save().then((res)=>{
//     console.log(res)}).catch((err)=>{
//         console.log(err)
//     });
//    res.redirect("/chats");
// });
// app.put("/chats/:id", async (req,res)=>{
//  let {id} = req.params;
//  let {msg:newmsg}= req.body;
//  let updatechat =  await Chat.findByIdAndUpdate(id, {msg:newmsg},{runvalidators:true, new:true});

// console.log(updatechat);
// res.redirect("/chats");
// });
// app.delete("/chats/:id",async (req,res)=>{
//     let {id} = req.params;
//     let del = await Chat.findByIdAndDelete(id);
//     console.log(del);
//     res.redirect("/chats");
// })
// app.listen(8080,()=>{
// console.log("app is listening");
// });



// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const Chat = require("./models/chat");

// // Initialize app
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
//     console.log("Database connection success");
//   } catch (err) {
//     console.error("Database connection error:", err);
//     process.exit(1);
//   }
// }

// // Routes
// app.get("/chats", async (req, res) => {
//   try {
//     const chats = await Chat.find({});
//     res.render("front", { chats });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// app.get("/chats/new", (req, res) => {
//   res.render("new");
// });

// // Add this route BEFORE your other routes
// app.get("/debug", async (req, res) => {
//   try {
//     const allChats = await Chat.find({});
//     console.log("=== DATABASE CONTENTS ===");
//     console.log(JSON.stringify(allChats, null, 2));
//     console.log("========================");
    
//     res.json({
//       count: allChats.length,
//       chats: allChats
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Debug failed" });
//   }
// });
// app.post("/chats", async (req, res) => {
//   try {
//     const { from, to, msg } = req.body;
//     const newChat = new Chat({
//       from,
//       to,
//       msg,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//     await newChat.save();
//     res.redirect("/chats");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error saving chat");
//   }
// });

// app.get("/chats/:id/edit", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const chat = await Chat.findById(id);
//     if (!chat) return res.status(404).send("Chat not found");
//     res.render("edit", { chat });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// app.put("/chats/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { msg: newMsg } = req.body;
//     const updatedChat = await Chat.findByIdAndUpdate(
//       id,
//       { msg: newMsg, updatedAt: new Date() },
//       { runValidators: true, new: true }
//     );
//     if (!updatedChat) return res.status(404).send("Chat not found");
//     res.redirect("/chats");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Update failed");
//   }
// });

// app.delete("/chats/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Chat.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).send("Chat not found");
//     res.redirect("/chats");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Delete failed");
//   }
// });

// // Home redirect
// app.get("/", (req, res) => {
//   res.redirect("/chats");
// });

// // Connect DB and start server ONLY if not in Vercel
// if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
//   connectDB().then(() => {
//     const PORT = process.env.PORT || 8080;
//     app.listen(PORT, () => {
//       console.log(`App is listening on port ${PORT}`);
//     });
//   });
// }

// // Export for Vercel
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
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

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

// Start server
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  connectDB().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  });
}

module.exports = app;