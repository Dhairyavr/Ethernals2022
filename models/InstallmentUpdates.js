const mongoose = require("mongoose");

const InstallmentUpdatesSchema = new mongoose.Schema({
  installment_id: {
    type: String,
  },
  project_id: {
    type: String,
    required: true,
  },
  round_id: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
  },
  video_url: {
    type: String,
  },
  description: {
    type: String,
  },
  yes: {
    type: Number,
    default: 0,
  },
  no: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("updates", InstallmentUpdatesSchema);
