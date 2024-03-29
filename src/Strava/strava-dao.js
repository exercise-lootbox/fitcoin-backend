import stravaModel from "./strava-model.js";

export const createStravaUser = (user) => {
  return stravaModel.create(user);
};

export const findStravaUserById = (userId) => {
  return stravaModel.findById(userId);
};

export const updateAccessToken = async (userId, newAccessToken) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { accessToken: newAccessToken },
    { new: true },
  );

  if (!updatedDoc) {
    throw new Error("User not found");
  }

  return updatedStravaUser.accessToken;
};

export const updateRefreshToken = async (userId, newRefreshToken) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { refreshToken: newRefreshToken },
    { new: true },
  );

  if (!updatedDoc) {
    throw new Error("User not found");
  }

  return updatedStravaUser.refreshToken;
};

export const updateExpiresAt = async (userId, newExpiresAt) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { expiresAt: newExpiresAt },
    { new: true },
  );

  if (!updatedDoc) {
    throw new Error("User not found");
  }

  return updatedStravaUser.expiresAt;
};
