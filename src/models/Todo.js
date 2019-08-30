const mongoose = require("mongoose");

const Todo = new mongoose.Schema({
  id_user: String,
  title: String,
  colorLabel: String,
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", Todo);
