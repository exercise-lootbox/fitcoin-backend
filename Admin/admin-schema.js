import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    _id: { ref: "UserModel", type: String, required: true }, // Firebase-given UID
    adminSince: { type: Date, required: true },
    lastUpdate: { type: Date, required: false },
  },
  { collection: "admin" },
);

export default adminSchema;
