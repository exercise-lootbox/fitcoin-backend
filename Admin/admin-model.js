import mongoose from "mongoose";
import adminSchema from "./admin-schema.js";

const adminModel = mongoose.model("AdminModel", adminSchema);

export default adminModel;
