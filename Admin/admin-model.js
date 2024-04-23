import mongoose from "mongoose";
import adminSchema from "./admin-schema";

const adminModel = mongoose.model("AdminModel", adminSchema);

export default adminModel;
