import userModel from "./user-model.js";

export const createUser = (user) => {
  return userModel.create(user);
};

export const findUserById = (userId) => userModel.findById(userId);

export const updateUser = (userId, user) =>
  userModel.updateOne({ _id: userId }, { $set: user });

export const deleteUser = (userId) => userModel.deleteOne({ _id: userId });

export const addStravaId = (userId, stravaId) =>
  userModel.updateOne({ _id: userId }, { $set: { stravaId } });

// Helper for buyItem
const addItemId = async (userId, itemId) => {
  await userModel.updateOne({ _id: userId }, { $push: { items: itemId } });
};

// Helper for buyItem
const removeCoins = async (userId, coins) => {
  await userModel.updateOne({ _id: userId }, { $inc: { coins: -coins } });
};

export const buyItem = async (userId, itemId, coins) => {
  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.coins < coins) {
    throw new Error("Not enough coins to buy the item");
  }

  if (!itemId || !coins) {
    throw new Error("Item ID and coins are required");
  }

  await addItemId(userId, itemId);
  await removeCoins(userId, coins);
};

export const getCoins = async (userId) => {
  const user = await findUserById(userId);
  return user.coins;
};

export const updateCoins = async (userId, coins) => {
  await userModel.updateOne({ _id: userId }, { $set: { coins } });
};

export const updateEmail = async (userId, email) => {
  await userModel.updateOne({ _id: userId }, { $set: { email } });
};

export const makeAdmin = async (userId) => {
  await userModel.updateOne({ _id: userId }, { $set: { adminId: userId } });
};

export const removeAdmin = async (userId) => {
  await userModel.updateOne({ _id: userId }, { $unset: { adminId: "" } });
};

export const retrieveItems = async (userId) => {
  const user = await findUserById(userId);
  return user.items;
};

export const findAllUsers = async () => {
  return await userModel.find({});
};
