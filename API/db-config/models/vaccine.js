var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(vaccineSchema = new Schema({
  name: String,
  description: String,
  availability: Number,
  origin: String,
})),
  (Band = mongoose.model("Band", bandSchema));

module.exports = Band;
