const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const Order = require("./models/Order");
const FinishedDelivery = mongoose.model(
  "FinishedDelivery",
  new mongoose.Schema(
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
        },
      ],
      contact: String,
      address: String,
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
  )
);

const RiderFinishedDelivery = require("./models/RiderFinishedDelivery");

mongoose
  .connect(
    "mongodb+srv://samueldagbo50:Sammy%40mongo1@cluster0.k1dcltl.mongodb.net/food-delivery?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// SCHEMAS
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: { type: String, enum: ["user", "admin", "rider"], default: "user" },
  })
);

const MenuItem = mongoose.model(
  "MenuItem",
  new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    available: { type: Boolean, default: true },
    image: { type: String, default: "" }, // stores Base64 string
  })
);

const fileUpload = require("express-fileupload");
app.use(fileUpload());

//Admin To Create Menu
// Backend: POST /admin/create-menu-item
// For debugging: You can log req.body here to inspect incoming data
app.post("/admin/create-menu-item", async (req, res) => {
  try {
    const { name, price, category, imageBase64 } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const newItemData = {
      name,
      price,
      category,
    };
    if (imageBase64) {
      newItemData.image = imageBase64;
    }

    const newItem = new MenuItem(newItemData);

    await newItem.save();
    console.log(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error("Error saving menu item:", err);
    res
      .status(500)
      .json({ success: false, error: "Server error while saving menu item" });
  }
});

// ROUTES
app.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }
  try {
    const existing = await User.findOne({ $or: [{ email }, { name }] });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }
    const user = new User({ name, email, password, phone });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ success: true, user });
});

app.get("/menu", async (req, res) => {
  try {
    const items = await MenuItem.find({ available: true });
    res.json(items); // Just return them directly
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

app.get("/seed-menu", async (req, res) => {
  try {
    const items = [
      {
        name: "Akple/Banku with fresh Tilapia light soup",
        price: 100,
        category: "BANKU / AKPLE ZONE",
      },
      {
        name: "Akple/Banku with hot pepper and fried/ grilled Tilapia",
        price: 100,
        category: "BANKU / AKPLE ZONE",
      },
      {
        name: "Akple/Banku with hot pepper and fried chicken",
        price: 70,
        category: "BANKU / AKPLE ZONE",
      },
      {
        name: "Akple/Banku with Gbomanyana",
        price: 90,
        category: "BANKU / AKPLE ZONE",
      },
      {
        name: "Eba with Ademe Mix with Okro",
        price: 75,
        category: "LOCAL MIX ZONE",
      },
      {
        name: "Boiled Yam with Kontomire/Garden Eggs/Egg Stews",
        price: 80,
        category: "LOCAL MIX ZONE",
      },
      {
        name: "Boiled Yam & Plantain with Kontomire/ Garden Eggss/Egg Stew",
        price: 90,
        category: "LOCAL MIX ZONE",
      },
      { name: "Gariforto", price: 85, category: "LOCAL MIX ZONE" },
      {
        name: "Banku/Akple with Okro (Beef, Salmon, Crab, Wele, Tilapia)",
        price: 100,
        category: "DE BLISS SPECIALS",
      },
      {
        name: "Loaded FriedRice (Fried Egg, Beef, Sausage, Chicken, Boiled Egg, Vegetables)",
        price: 100,
        category: "DE BLISS SPECIALS",
      },
      {
        name: "Loaded Jollof (Fried Egg, Beef, Sausage, Chicken, Boiled Egg)",
        price: 100,
        category: "DE BLISS SPECIALS",
      },
      { name: "Superb Jollof", price: 85, category: "JOLLOF ZONE" },
      { name: "Beef Jollof", price: 90, category: "JOLLOF ZONE" },
      { name: "Beef Sauce With Jollof", price: 95, category: "JOLLOF ZONE" },
      { name: "Chicken Sauce With Jollof", price: 95, category: "JOLLOF ZONE" },
      {
        name: "Jollof Rice With Grilled Chicken",
        price: 75,
        category: "JOLLOF ZONE",
      },
      { name: "Jollof With Fish", price: 75, category: "JOLLOF ZONE" },
      {
        name: "Assorted Jollof With Fried Chicken",
        price: 90,
        category: "ASSORTED ZONE",
      },
      {
        name: "Assorted Jollof With Grilled Chicken",
        price: 90,
        category: "ASSORTED ZONE",
      },
      {
        name: "Assorted Fried Rice With Fried Chicken",
        price: 90,
        category: "ASSORTED ZONE",
      },
      {
        name: "Assorted Fried Rice With Grilled Chicken",
        price: 90,
        category: "ASSORTED ZONE",
      },
      { name: "Assorted Noodles", price: 80, category: "ASSORTED ZONE" },
      { name: "Assorted Spaghetti", price: 80, category: "ASSORTED ZONE" },
      {
        name: "Egg Fried Rice With Fried Chicken",
        price: 75,
        category: "FRIED RICE ZONE",
      },
      {
        name: "Egg Fried Rice With Grilled Chicken",
        price: 75,
        category: "FRIED RICE ZONE",
      },
      {
        name: "Egg Fried Rice With Chicken Sauce",
        price: 85,
        category: "FRIED RICE ZONE",
      },
      {
        name: "Egg Fried Rice With Beef Sauce",
        price: 90,
        category: "FRIED RICE ZONE",
      },
      {
        name: "Egg Fried Rice With Fish",
        price: 75,
        category: "FRIED RICE ZONE",
      },
      { name: "Vegetables Fried Rice", price: 60, category: "FRIED RICE ZONE" },
      {
        name: "Plain Rice With Kontomire",
        price: 85,
        category: "PLAIN RICE ZONE",
      },
      {
        name: "Plain Rice With Egg Stew",
        price: 85,
        category: "PLAIN RICE ZONE",
      },
      {
        name: "Plain Rice With Vegetable",
        price: 85,
        category: "PLAIN RICE ZONE",
      },
      {
        name: "Yam chips With Fried Chicken",
        price: 70,
        category: "FRIES ZONE",
      },
      {
        name: "Yam Chips With Grilled Chicken",
        price: 70,
        category: "FRIES ZONE",
      },
      {
        name: "French Fries With Fried Chicken",
        price: 80,
        category: "FRIES ZONE",
      },
      {
        name: "French Fries With Grilled Chicken",
        price: 70,
        category: "FRIES ZONE",
      },
      { name: "Vegetable Shawarma", price: 70, category: "SHAWARMA ZONE" },
      { name: "Chicken Shawarma", price: 75, category: "SHAWARMA ZONE" },
      { name: "Beef Shawarma", price: 80, category: "SHAWARMA ZONE" },
      { name: "Mix Shawarma", price: 90, category: "SHAWARMA ZONE" },
      { name: "Vegetable Salad", price: 70, category: "SALAD ZONE" },
      { name: "Potato Salad", price: 80, category: "SALAD ZONE" },
      { name: "Chicken Salad", price: 880, category: "SALAD ZONE" },
      { name: "Samosa", price: 15, category: "SALAD ZONE" },
      { name: "Spring rolls", price: 15, category: "SALAD ZONE" },
      { name: "Couscous", price: 25, category: "SALAD ZONE" },
      { name: "Extra Okro Soup", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Ademe Soup", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Aborbi Tadi", price: 70, category: "EXTRA ZONE" },
      { name: "Extra Totonyanya", price: 80, category: "EXTRA ZONE" },
      { name: "Extra Detsiffuiffui", price: 80, category: "EXTRA ZONE" },
      { name: "Extra Gbomanyanya", price: 80, category: "EXTRA ZONE" },
      { name: "Extra Equishie Stew", price: 70, category: "EXTRA ZONE" },
      { name: "Extra Palava Sauce Stew", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Garden Eggs Stew", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Egg Stew", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Vegetable Stew", price: 60, category: "EXTRA ZONE" },
      { name: "Extra Chicken Sauce", price: 70, category: "EXTRA ZONE" },
      { name: "Extra Beef Sauce", price: 70, category: "EXTRA ZONE" },
      { name: "Extra Banku", price: 5, category: "EXTRA ZONE" },
      { name: "Extra Akpele", price: 5, category: "EXTRA ZONE" },
      { name: "Extra Boiled Yam", price: 30, category: "EXTRA ZONE" },
      { name: "Extra Boiled Plantain", price: 30, category: "EXTRA ZONE" },
      { name: "Extra Fish", price: 20, category: "EXTRA ZONE" },
      { name: "Extra Tilapia Half", price: 40, category: "EXTRA ZONE" },
      { name: "Extra Beef", price: 25, category: "EXTRA ZONE" },
      { name: "Extra Wele", price: 15, category: "EXTRA ZONE" },
      { name: "Extra Crab", price: 15, category: "EXTRA ZONE" },
      { name: "Extra Egg", price: 10, category: "EXTRA ZONE" },
      { name: "Extra Chicken", price: 30, category: "EXTRA ZONE" },
      { name: "Extra Pepper", price: 5, category: "EXTRA ZONE" },
      { name: "Extra Vegetable", price: 15, category: "EXTRA ZONE" },
      { name: "Extra Plain Rice", price: 30, category: "EXTRA ZONE" },
      { name: "Extra Jollof", price: 35, category: "EXTRA ZONE" },
      { name: "Extra Fried Rice", price: 35, category: "EXTRA ZONE" },
      { name: "Extra Coleslaw", price: 5, category: "EXTRA ZONE" },
    ];

    // Add default image if not present
    const itemsWithImage = items.map((item) => ({
      ...item,
      image: "",
    }));

    // Insert only if not already present (by name)
    for (const item of itemsWithImage) {
      const exists = await MenuItem.findOne({ name: item.name });
      if (!exists) {
        await MenuItem.create(item);
      }
    }

    const allMenu = await MenuItem.find();
    res.json({ message: "Menu seeded!", menu: allMenu });
  } catch (err) {
    res.status(500).json({ error: "Failed to seed menu" });
  }
});

app.post("/admin/update-price", async (req, res) => {
  const { id, price } = req.body;
  try {
    await MenuItem.findByIdAndUpdate(id, { price: parseFloat(price) });
    const updated = await MenuItem.find();
    res.json({ success: true, menuItems: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

app.post("/admin/create-user", async (req, res) => {
  const { name, password, role, phone } = req.body;
  if (!name || !password || !role) {
    return res
      .status(400)
      .json({ success: false, error: "All fields are required" });
  }
  try {
    const existing = await User.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }
    const newUser = new User({ name, password, role, phone });
    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/order", async (req, res) => {
  const { userId, userName, items, contact, address } = req.body;
  try {
    const newOrder = new Order({
      userId,
      userName,
      items,
      contact,
      address,
      pending: "⌛ Pending Confirmation",
      confirmed: null,
      preparing: null,
      packing: null,
      outForDelivery: null,
    });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Failed to save order:", error);
    res.status(500).json({ success: false, error: "Order failed" });
  }
});

app.get("/user-orders/:userId", async (req, res) => {
  try {
    console.log("Fetching orders for userId:", req.params.userId);
    const orders = await Order.find({ userId: req.params.userId })
      .populate("items.menuItem")
      .populate("riderId", "name phone");
    console.log("Found orders:", orders.length);
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user-finished-orders/:userId", async (req, res) => {
  try {
    console.log("Fetching finished orders for userId:", req.params.userId);
    const orders = await FinishedDelivery.find({ userId: req.params.userId })
      .populate("items.menuItem")
      .populate("riderId", "name phone");
    console.log("Found finished orders:", orders.length);
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch finished orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem")
      .populate("userId", "name email phone")
      .populate("riderId", "name phone");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/admin/order-status", async (req, res) => {
  const { orderId, statusKey, value } = req.body;
  // ✅ Validate input
  const allowedFields = ["confirmed", "preparing", "packing", "outForDelivery"];
  if (!allowedFields.includes(statusKey)) {
    return res.status(400).json({ error: "Invalid status field" });
  }

  try {
    const update = {};
    update[statusKey] = value;

    await Order.findByIdAndUpdate(orderId, { $set: update });
    res.json({ success: true, message: `Updated ${statusKey} to "${value}"` });
  } catch (err) {
    console.error("Failed to update status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

app.get("/admin/rider-finished-deliveries", async (req, res) => {
  try {
    const deliveries = await RiderFinishedDelivery.find()
      .populate("userId", "name")
      .populate("riderId", "name phone")
      .populate("items.menuItem");
    res.json(deliveries);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ error: "Failed to fetch finished deliveries" });
  }
});

app.get("/admin/finished-orders", async (req, res) => {
  try {
    const finishedOrders = await FinishedDelivery.find()
      .populate("userId", "name email phone")
      .populate("riderId", "name phone")
      .populate("items.menuItem");
    res.json(finishedOrders);
  } catch (error) {
    console.error("Error fetching finished orders:", error);
    res.status(500).json({ error: "Failed to fetch finished orders" });
  }
});

app.post("/admin/assign-rider", async (req, res) => {
  const { orderId, riderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.riderId = riderId;
    await order.save();

    res.json({ message: "Rider assigned successfully" });
  } catch (err) {
    console.error("Error assigning rider:", err);
    res.status(500).json({ error: "Failed to assign rider" });
  }
});

app.get("/users/riders", async (req, res) => {
  try {
    const riders = await User.find({ role: "rider" });
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch riders" });
  }
});

app.get("/admin/riders", async (req, res) => {
  try {
    const riders = await User.find({ role: "rider" }, "name _id phone");
    res.json(riders);
  } catch (err) {
    console.error("Failed to fetch riders:", err);
    res.status(500).json({ error: "Failed to fetch riders" });
  }
});

app.get("/rider/current-orders/:riderId", async (req, res) => {
  try {
    const orders = await Order.find({ riderId: req.params.riderId })
      .populate("userId", "name")
      .populate("items.menuItem");
    res.json(orders);
  } catch (err) {
    console.error("Error fetching rider current orders:", err);
    res.status(500).json({ error: "Failed to fetch current orders" });
  }
});

app.get("/rider/finished-orders/:riderId", async (req, res) => {
  try {
    const deliveries = await RiderFinishedDelivery.find({
      riderId: req.params.riderId,
    })
      .populate("userId", "name")
      .populate("items.menuItem");
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch finished orders" });
  }
});

app.delete("/admin/finished-orders/:orderId", async (req, res) => {
  try {
    const deleted = await FinishedDelivery.findByIdAndDelete(
      req.params.orderId
    );
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: "Failed to delete finished order" });
  }
});

//Admin Updating and Editing Menu Item
app.put("/admin/update-menu-item/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category, imageBase64 } = req.body;
  try {
    const updateFields = { name, price, category };
    if (imageBase64) updateFields.image = imageBase64;
    const updated = await MenuItem.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ success: false, error: "Item not found" });
    res.json({ success: true, item: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: "Failed to update item" });
  }
});

app.delete("/admin/delete-menu-item/:id", async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: "Failed to delete item" });
  }
});

// User marks order as finished (received)
app.post("/user/mark-finished", async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("riderId")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Move to FinishedDelivery (user/admin)
    const finished = new FinishedDelivery({
      userId: order.userId._id,
      riderId: order.riderId?._id,
      contact: order.contact,
      address: order.address,
      items: order.items,
      pending: order.pending,
      confirmed: order.confirmed,
      preparing: order.preparing,
      packing: order.packing,
      outForDelivery: order.outForDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
    await finished.save();

    // Also create RiderFinishedDelivery if a rider is assigned
    if (order.riderId) {
      const RiderFinishedDeliveryModel = mongoose.model(
        "RiderFinishedDelivery"
      );
      const riderFinished = new RiderFinishedDeliveryModel({
        userId: order.userId._id,
        riderId: order.riderId._id,
        contact: order.contact,
        address: order.address,
        items: order.items,
      });
      await riderFinished.save();
    }

    await Order.findByIdAndDelete(orderId);
    res.json({ message: "Order moved to finished orders for user and rider." });
  } catch (err) {
    res.status(500).json({ error: "Failed to move order to finished" });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on http://localhost:3000");
});
