const userItemSchema = new mongoose.Schema(
  {
    _id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  },
  { collection: "user_item" },
);
