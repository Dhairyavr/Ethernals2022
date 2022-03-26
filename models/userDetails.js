const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  wallet_address: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
  },
  profile_img: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
