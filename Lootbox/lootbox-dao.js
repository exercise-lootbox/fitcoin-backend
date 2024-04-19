import lootboxModel from "./lootbox-model.js";

export const findAllLootboxes = async () => {
  return lootboxModel.find();
};

export const findLootboxById = async (lootboxId) => {
  return lootboxModel.findById(lootboxId);
};
