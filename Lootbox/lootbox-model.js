import mongoose from "mongoose";
import lootboxSchema from "./strava-schema.js";

const lootboxModel = mongoose.model("LootboxModel", lootboxSchema);

export default lootboxModel;
