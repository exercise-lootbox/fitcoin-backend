import * as lootboxDao from "../Lootbox/lootbox-dao.js";
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    lootbox_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rarity: {
      type: String,
      enum: ["COMMON", "UNCOMMON", "EPIC", "LEGENDARY"],
      required: true,
    },
  },
  {
    collection: "item",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

export default itemSchema;
