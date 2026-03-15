const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "claimed"],
    default: "pending"
  },

  dateLost: Date,
  dateFound: Date,

  locationLost: String,
  locationFound: String,

  storageLocation: String,

  images: [
    {
      type: String
    }
  ],

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

itemSchema.index({ title: "text", description: "text" });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });

module.exports = mongoose.model("Item", itemSchema);