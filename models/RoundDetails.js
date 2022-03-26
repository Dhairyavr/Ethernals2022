const mongoose = require("mongoose");

const RoundDetailsSchema = new mongoose.Schema({
  installment_start_3: [String],
  installment_start_5: [String],
  installment_start_7: [String],
  voting_end_3: [String],
  voting_end_5: [String],
  voting_end_7: [String],
});

module.exports = mongoose.model("RoundDetails", RoundDetailsSchema);
