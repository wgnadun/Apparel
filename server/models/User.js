const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allows null values but ensures uniqueness when present
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Make optional for Auth0 users
  },
  phone: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "user",
  },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;