var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(appointmentSchema = new Schema({
  bid: Number,
  name: String,
  date: String,
  Dose: String,
  vaccine: String,
  userUid: Number,
})),
  (appointment = mongoose.model("appointment", appointmentSchema));

module.exports = appointment;
