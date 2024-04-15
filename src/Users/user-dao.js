import userModel from "./user-model.js";

export const createUser = (user) => {
  return userModel.create(user);
};

export const findUserById = (userId) => userModel.findById(userId);

export const updateUser = async (userId, user) => {
  await userModel.updateOne({ _id: userId }, { $set: user });
  const updatedUser = await userModel.findOne({ _id: userId });

  return updatedUser;
};

export const deleteUser = (userId) => userModel.deleteOne({ _id: userId });
