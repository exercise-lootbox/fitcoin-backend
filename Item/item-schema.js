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

itemSchema.virtual("percentage").get(function () {
  const { rarity, lootbox_id } = this;
  const percentageMap = {
    COMMON: 0.6,
    UNCOMMON: 0.3,
    EPIC: 0.08,
    LEGENDARY: 0.02,
  };
  // const totalRareItems = await lootboxDao.getItemsByRarity(lootbox_id, rarity);
  return percentageMap[rarity.toUpperCase()] || 0;
});

itemSchema.virtual("sellPrice").get(function () {
  const { rarity, lootbox_id } = this;

  // const lootbox = lootboxDao.findLootboxById(lootbox_id);
  // console.log("lootbox", lootbox);

  // const lootBoxPrice = lootbox.price;

  const sellPriceMap = {
    COMMON: 50,
    UNCOMMON: 100,
    EPIC: 200,
    LEGENDARY: 250,
  };

  const rarityPercentage = sellPriceMap[rarity.toUpperCase()] || 0;

  return rarityPercentage;
});

export default itemSchema;
