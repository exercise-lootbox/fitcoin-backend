import stravaModel from "./strava-model.js";
import * as userDao from "../Users/user-dao.js";

export const createStravaUser = async (user) => {
  await stravaModel.create(user);
  await userDao.addStravaId(user._id, user.stravaId);
};

export const findStravaUserById = (userId) => {
  return stravaModel.findById(userId);
};

export const findStravaUserByStravaId = async (stravaId) => {
  return await stravaModel.findOne({ stravaId: stravaId });
};

export const updateAccessToken = async (userId, newAccessToken) => {
  let updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { accessToken: newAccessToken },
    { new: true },
  );
  return updatedStravaUser.accessToken;
};

export const updateRefreshToken = async (userId, newRefreshToken) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { refreshToken: newRefreshToken },
    { new: true },
  );
  return updatedStravaUser.refreshToken;
};

export const updateExpiresAt = async (userId, newExpiresAt) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { _id: userId },
    { expiresAt: newExpiresAt },
    { new: true },
  );
  return updatedStravaUser.expiresAt;
};

export const updateRecentActivities = async (stravaId, newActivities) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { stravaId: stravaId },
    { recentActivities: newActivities },
    { new: true },
  );
  return updatedStravaUser.recentActivities;
};

export const updateLastSyncedAt = async (stravaId, newLastSyncedAt) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { stravaId: stravaId },
    { lastSyncedAt: newLastSyncedAt },
    { new: true },
  );
  return updatedStravaUser.lastSyncedAt;
};

export const updateRecentCoinsGained = async (stravaId, newCoinsGained) => {
  const updatedStravaUser = await stravaModel.findOneAndUpdate(
    { stravaId: stravaId },
    { recentCoinsGained: newCoinsGained },
    { new: true },
  );
  return updatedStravaUser.recentCoinsGained;
};

export const getLastSyncedAt = async (stravaId) => {
  const stravaUser = await stravaModel.findOne({ stravaId: stravaId });
  return stravaUser.lastSyncedAt || undefined;
};

export const getRecentActivities = async (stravaId) => {
  const stravaUser = await stravaModel.findOne({ stravaId: stravaId });
  return stravaUser.recentActivities || [];
};

export const getRecentCoinsGained = async (stravaId) => {
  const stravaUser = await stravaModel.findOne({ stravaId: stravaId });
  return stravaUser.recentCoinsGained || 0;
};

export const resetStravaSync = async (stravaId) => {
  await stravaModel.findOneAndUpdate(
    { stravaId: stravaId },
    { lastSyncedAt: 0 },
    { new: true },
  );
};
