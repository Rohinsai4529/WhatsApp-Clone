const mongoose = require('mongoose');



const MONGO_URI = "mongodb+srv://rohinsainomula:Rohinsai@2418@cluster0.6y1glfz.mongodb.net/what?retryWrites=true&w=majority"

async function test() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ SUCCESS! Connected to:", mongoose.connection.db.databaseName);
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  }
}

test();