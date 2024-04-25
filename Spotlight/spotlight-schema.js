import mongoose from "mongoose";

const spotlightSchema = new mongoose.Schema(
  {
    userId: { ref: "UserModel", type: String, required: true }, // Firebase-given UID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    coinsEarned: { type: Number, required: true },
  },
  { collection: "spotlight" },
);

export default spotlightSchema;
