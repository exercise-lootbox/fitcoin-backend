import mongoose from "mongoose";

const stravaSchema = new mongoose.Schema(
  {
    _id: { ref: "UserModel", type: String, required: true }, // Firebase-given UID
    stravaId: { type: String, required: true }, // The user's Strava athlete ID
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: String, required: true },
  },
  { collection: "strava" },
);

export default stravaSchema;
