var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
  uid: Number,
  name: String,
  email: String,
  password: String,
  dob: String,
  otp: String,
})),
  (User = mongoose.model("User", userSchema));

module.exports = User;
