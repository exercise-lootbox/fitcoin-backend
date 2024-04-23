import mongoose from "mongoose";
import lootboxSchema from "./lootbox-schema.js";

const lootboxModel = mongoose.model("LootboxModel", lootboxSchema);

export default lootboxModel;
