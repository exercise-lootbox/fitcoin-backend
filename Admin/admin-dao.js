import adminModel from "./admin-model";

export const getAdmin = async (adminId) => {
  return adminModel.findById(adminId);
};

export const updateLastUpdate = async (adminId) => {
  await adminModel.updateOne(
    { _id: adminId },
    { $set: { lastUpdate: new Date() } },
  );
};
