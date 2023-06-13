const mongoose = require("mongoose")

const Rec = new mongoose.Schema({
      title: String,
      category: String,
      recordTime: {
            type: Date,
            immutable: true,
            default: () => Date.now()
      },
      details: {}
})

module.exports = mongoose.model("Rec", Rec);
