import adminModel from "./admin-model.js";

export const getAdmin = async (adminId) => {
  return adminModel.findById(adminId);
};

export const updateLastUpdate = async (adminId) => {
  await adminModel.updateOne(
    { _id: adminId },
    { $set: { lastUpdate: new Date() } },
  );
};

export const createAdmin = async (adminId) => {
  const admin = { _id: adminId, adminSince: new Date() };
  await adminModel.create(admin);
};

export const deleteAdmin = async (adminId) => {
  await adminModel.deleteOne({ _id: adminId });
};
