import mongoose from "mongoose";

const stravaSchema = new mongoose.Schema(
  {
    _id: { ref: "UserModel", type: String, required: true }, // Firebase-given UID
    stravaId: { type: String, required: true }, // The user's Strava athlete ID
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: Number, required: true },
    lastSyncedAt: { type: Number, required: false },
    // This is for loading their recent activities so we don't keep fetching from Strava
    recentActivities: { type: Array, required: false, default: []},
    recentCoinsGained: { type: Number, required: false, default: 0}
  },
  { collection: "strava" },
);

export default stravaSchema;
