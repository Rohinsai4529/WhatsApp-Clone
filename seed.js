



const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

// Get command from CLI: node seed.js --fresh
const fresh = process.argv.includes('--fresh');

async function seedDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/what');
    // console.log("✅ Connected to database");

    // Clear database if --fresh flag is used
    if (fresh) {
      await Chat.deleteMany({});
      console.log(" Cleared all existing chats");
    }

    const allChats = [
      {
        from: "Flash man",
        to: "sweety",
        msg: "Fried rice Elaundi",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: "Raju Danger ",
        to: "Kodangal",
        msg: "maklav*",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: "modi",
        to: "all ppl",
        msg: "nee yamma den*",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        from: "Rohin",
        to: "Rakesh",
        msg: "how are you",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await Chat.insertMany(allChats);
    // console.log(`✅ Inserted ${result.length} chats successfully`);
    
    await mongoose.connection.close();
    // console.log("🔌 Connection closed");
    
  } catch (err) {
    console.error(" Error:", err.message);
    process.exit(1);
  }
}

seedDB();