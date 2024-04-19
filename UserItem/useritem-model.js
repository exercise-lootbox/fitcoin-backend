import mongoose from "mongoose";
import userItemSchema from "./useritem-schema.js";

const userItemModel = mongoose.model("UserItemModel", userItemSchema);
export default userItemModel;
