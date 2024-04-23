import itemModel from "./item-model.js";

export const findItems = async () => {
  const items = await itemModel.find();
  return items;
};

export const findItemById = async (itemId) => {
  const item = await itemModel.findById(itemId);
  return item;
};

export const findAllItemsByLootbox = async (lootboxId) => {
  const items = await itemModel.find({ lootbox_id: lootboxId });
  return items;
};
