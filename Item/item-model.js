import mongoose from "mongoose";
import itemSchema from "./item-schema.js";

const itemModel = mongoose.model("ItemModel", itemSchema);

export default itemModel;
