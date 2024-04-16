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
