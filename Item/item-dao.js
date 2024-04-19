import itemModel from "./item-model";

export const findItems = async () => {
  const items = await itemModel.find();
  return items;
};

export const findItemById = async (itemId) => {
  const item = await itemModel.findById(itemId);
  return item;
};

export const findAllItemsByLootbox = async (lootboxId) => {
  const items = await itemModel.find({ lootbox: lootboxId });
  return items;
};
