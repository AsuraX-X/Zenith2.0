const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: Number,
    },
  ],
  contact: String,
  address: String,
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  pending: String,
  confirmed: String,
  preparing: String,
  packing: String,
  outForDelivery: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

//✅ Pending
//✅ Confirmed
//✅ Preparing
//⌛ Packing
//⌛ Out for Delivery
//⌛ Delivered