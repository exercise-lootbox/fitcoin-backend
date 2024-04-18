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

export const getCoins = async (userId) => {
  const user = await findUserById(userId);
  return user.coins;
};

export const updateCoins = async (userId, coins) => {
  await userModel.updateOne({ _id: userId }, { $set: { coins } });
};
