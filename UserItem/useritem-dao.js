import userItemModel from "./useritem-model.js";
import mongoose from "mongoose";
import * as userDao from "../Users/user-dao.js";

export const createUserItem = async (userItem) => {
  await userItemModel.create(userItem);
};

export const getItemsByUserId = async (userId) => {
  return userItemModel.find({ user: userId });
};

export const getUserItems = async () => {
  return userItemModel.find();
};

export const getUserItem = async (userItemId) => {
  return userItemModel.findById(userItemId);
};

export const sellItem = async (userItemId, userId, itemId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userItem = await userItemModel.findById(userItemId).session(session);
    if (!userItem) {
      throw new Error("UserItem not found");
    }

    const item = await itemModel.findById(itemId).session(session);

    const { sellPrice } = item.sellPrice;

    await userItem.deleteOne({ _id: userItemId }).session(session);

    await userDao.updateCoins(userId, sellPrice).session(session);

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Transaction completed successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during transaction:", error);
    return { success: false, message: "Transaction failed" };
  }
};
