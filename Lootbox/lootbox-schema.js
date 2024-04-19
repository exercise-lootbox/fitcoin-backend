import mongoose from "mongoose";

const lootboxSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { collection: "lootbox" },
);

export default lootboxSchema;
