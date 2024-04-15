import stravaModel from "./strava-model.js";
import * as userDao from "../Users/user-dao.js";

export const createStravaUser = async (user) => {
  await stravaModel.create(user);
  await userDao.addStravaId(user._id, user.stravaId);
};

export const findStravaUserById = (userId) => {
  return stravaModel.findById(userId);
};

export const updateAccessToken = async (userId, newAccessToken) => {
  let updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { accessToken: newAccessToken },
    { new: true },
  );
  console.log("updatedStravaUser", updatedStravaUser);

  // if (!updatedDoc) {
  //   throw new Error("User not found");
  // }

  return updatedStravaUser.accessToken;
};

export const updateRefreshToken = async (userId, newRefreshToken) => {
  console.log("userId", userId);
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { refreshToken: newRefreshToken },
    { new: true },
  );

  // if (!updatedDoc) {
  //   throw new Error("User not found");
  // }

  return updatedStravaUser.refreshToken;
};

export const updateExpiresAt = async (userId, newExpiresAt) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { expiresAt: newExpiresAt },
    { new: true },
  );

  // if (!updatedDoc) {
  //   throw new Error("User not found");
  // }

  return updatedStravaUser.expiresAt;
};
