import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String, // Firebase-given UID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    stravaId: {
      ref: "StravaModel",
      type: String,
      required: false,
      default: "",
    },
    coins: { type: Number, required: false, default: 0 },
    items: { type: [String], required: false, default: [] },
    adminId: { ref: "AdminModel", type: String, required: false },
  },
  { collection: "users" },
);

export default userSchema;
