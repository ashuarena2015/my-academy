const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !!this.password;
      },
    }, // Required only for registration
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    dob: { type: String, required: false },
    address: { type: String, required: false },
    adminRole: { type: String, required: false },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
