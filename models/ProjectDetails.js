const mongoose = require("mongoose");
const user = require("./userDetails");

const projectdetailsSchema = new mongoose.Schema({
  round_id: {
    type: String,
    required: true,
  },
  project_id: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  no_of_installments: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  updated_installments: [String],
  approved_installments: [String],
});

module.exports = mongoose.model("projects", projectdetailsSchema);
