const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Use environment variable directly or fallback to local MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zenith";

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected for user reset"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log("Trying with default local MongoDB URI...");
    return mongoose.connect("mongodb://localhost:27017/zenith");
  });

// Define schemas (same as in main app)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, enum: ["user", "admin", "rider"], default: "user" },
  resetToken: String,
  resetTokenExpiry: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

// Order schema for cleanup
const Order = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      items: Array,
      contact: String,
      location: Object,
      riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      pending: String,
      confirmed: String,
      preparing: String,
      packing: String,
      outForDelivery: String,
    },
    { timestamps: true }
  )
);

// FinishedDelivery schema for cleanup
const FinishedDelivery = mongoose.model(
  "FinishedDelivery",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      items: Array,
      contact: String,
      location: Object,
      riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      pending: String,
      confirmed: String,
      preparing: String,
      packing: String,
      outForDelivery: String,
    },
    { timestamps: true }
  )
);

// RiderFinishedDelivery schema for cleanup
const RiderFinishedDelivery = mongoose.model(
  "RiderFinishedDelivery",
  new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: String,
      riderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      contact: String,
      address: String,
      items: Array,
    },
    { timestamps: true }
  )
);

async function resetUsersAndOrders() {
  try {
    console.log("🗑️  Starting cleanup process...");

    // 1. Delete all orders (they reference users)
    console.log("Deleting all active orders...");
    const deletedOrders = await Order.deleteMany({});
    console.log(`✅ Deleted ${deletedOrders.deletedCount} active orders`);

    // 2. Delete all finished deliveries
    console.log("Deleting all finished deliveries...");
    const deletedFinished = await FinishedDelivery.deleteMany({});
    console.log(
      `✅ Deleted ${deletedFinished.deletedCount} finished deliveries`
    );

    // 3. Delete all rider finished deliveries
    console.log("Deleting all rider finished deliveries...");
    const deletedRiderFinished = await RiderFinishedDelivery.deleteMany({});
    console.log(
      `✅ Deleted ${deletedRiderFinished.deletedCount} rider finished deliveries`
    );

    // 4. Delete all users
    console.log("Deleting all users...");
    const deletedUsers = await User.deleteMany({});
    console.log(`✅ Deleted ${deletedUsers.deletedCount} users`);

    // 5. Create new admin user
    console.log("Creating new admin user...");
    const adminUser = new User({
      name: "admin",
      email: "admin@zenith.com",
      password: "admin123", // Will be hashed by pre-save hook
      phone: "+233123456789",
      role: "admin",
    });
    await adminUser.save();
    console.log("✅ Admin user created:");
    console.log("   Name: admin");
    console.log("   Email: admin@zenith.com");
    console.log("   Password: admin123");

    // 6. Create new rider user
    console.log("Creating new rider user...");
    const riderUser = new User({
      name: "rider",
      email: "rider@zenith.com",
      password: "rider123", // Will be hashed by pre-save hook
      phone: "+233987654321",
      role: "rider",
    });
    await riderUser.save();
    console.log("✅ Rider user created:");
    console.log("   Name: rider");
    console.log("   Email: rider@zenith.com");
    console.log("   Password: rider123");

    console.log("🎉 Database reset complete!");
    console.log("");
    console.log("📋 Login Credentials:");
    console.log("Admin Login:");
    console.log("  Username/Email: admin or admin@zenith.com");
    console.log("  Password: admin123");
    console.log("");
    console.log("Rider Login:");
    console.log("  Username/Email: rider or rider@zenith.com");
    console.log("  Password: rider123");
  } catch (error) {
    console.error("❌ Error during reset:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Run the reset
resetUsersAndOrders();
