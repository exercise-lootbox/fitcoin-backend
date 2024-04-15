import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: String, // Firebase-given UID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    // stravaId: { type: String, required: false, default: "" },
    stravaId: {
      ref: "StravaModel",
      type: String,
      required: false,
      default: "",
    },
  },
  { collection: "users" },
);

export default userSchema;
