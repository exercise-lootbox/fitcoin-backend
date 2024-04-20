import mongoose from "mongoose";
import stravaSchema from "./strava-schema.js";

const stravaModel = mongoose.model("StravaModel", stravaSchema);

export default stravaModel;
