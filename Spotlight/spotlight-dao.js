import spotlightModel from "./spotlight-model.js";

export const getMemberSpotlight = async () => {
  return spotlightModel.find();
};

export const removeSpotlightMember = async (userId) => {
  await spotlightModel.deleteOne({ _id: userId });
};

export const addSpotlightMember = async (spotlightMember) => {
  await spotlightModel.create(spotlightMember);
};
