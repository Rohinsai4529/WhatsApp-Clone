// const mongoose = require('mongoose');

// const chatSchema = mongoose.Schema({
//     from:
//     {
//         type:String,
//         required:true
//     },
//     to:
//     {
//         type:String,
//         required:true
//     },
// msg:{
//     type:String,
//     maxLength:50,
// },
// create:{
//     type:Date,
//     required:true
// },
// updatedate:{
//     type:Date,
//     required:true
// }
// });

// const Chat = mongoose.model("Chat",chatSchema);
// module.exports = Chat;


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