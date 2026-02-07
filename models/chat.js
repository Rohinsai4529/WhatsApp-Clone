


const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  msg: {
    type: String,
    required: true,
    maxLength: 500,
    trim: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: false
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;