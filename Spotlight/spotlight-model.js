import mongoose from "mongoose";
import spotlightSchema from "./spotlight-schema.js";

const spotlightModel = mongoose.model("SpotlightModel", spotlightSchema);

export default spotlightModel;
