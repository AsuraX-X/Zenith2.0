const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: Number,
        accompaniments: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],
    contact: String,
    location: {
      name: String,
      lat: Number,
      lon: Number,
    },
    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup"],
      default: "delivery",
    },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    pending: String,
    confirmed: String,
    preparing: String,
    packing: String,
    outForDelivery: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

//✅ Pending
//✅ Confirmed
//✅ Preparing
//⌛ Packing
//⌛ Out for Delivery
//⌛ Delivered
