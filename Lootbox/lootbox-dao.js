import lootboxModel from "./lootbox-model.js";
import itemModel from "../Item/item-model.js";
import mongoose from "mongoose";

export const findAllLootboxes = async () => {
  return lootboxModel.find();
};

export const findLootboxById = async (lootboxId) => {
  try {
    const lootbox = await lootboxModel.findOne({
      _id: lootboxId,
    });
    return lootbox;
  } catch (error) {
    console.error("Error finding lootbox by ID:", error);
  }
};

export const getItemsByRarity = async (lootboxId, rarity) => {
  return itemModel.find({ lootboxId, rarity });
};

export const updateLootboxPrice = async (lootboxId, price) => {
  await lootboxModel.updateOne({ _id: lootboxId }, { $set: { price } });
}
