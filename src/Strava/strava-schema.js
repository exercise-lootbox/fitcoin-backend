import mongoose from "mongoose";

const stravaSchema = new mongoose.Schema(
  {
    _id: String, // The user's Firebase ID
    stravaId: { type: String, required: true }, // The user's Strava athlete ID
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresAt: { type: String, required: true },
  },
  { collection: "strava" },
);

export default stravaSchema;
