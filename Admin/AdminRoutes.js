import { authMiddleware } from "../authMiddleware.js";
import * as dao from "./admin-dao.js";
import * as userDao from "../Users/user-dao.js";
import * as stravaDao from "../Strava/strava-dao.js";
import * as lootboxDao from "../Lootbox/lootbox-dao.js";

export default function AdminRoutes(app) {
  const getAdmin = async (req, res) => {
    const { adminId } = req.params;
    const admin = await dao.getAdmin(adminId);

    if (!admin) {
      res.sendStatus(404);
      return;
    }
    res.json(admin);
  };

  const updateUserCoins = async (req, res) => {
    try {
      const { uid } = req.params;
      const { adminId, coins } = req.body;

      const admin = await dao.getAdmin(adminId);
      const user = await userDao.findUserById(uid);

      if (!admin || !user) {
        res.status(401).json({ error: "User or admin does not exist" });
        return;
      }

      await userDao.updateCoins(uid, coins);
      await dao.updateLastUpdate(adminId);

      res.json({ coins });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  };

  const resetUserStravaSync = async (req, res) => {
    try {
      const { uid } = req.params;
      const { adminId } = req.body;

      const admin = await dao.getAdmin(adminId);
      const user = await userDao.findUserById(uid);

      if (!admin || !user) {
        res.status(401).json({ error: "User or admin does not exist" });
        return;
      }

      await stravaDao.resetStravaSync(user.stravaId);
      await dao.updateLastUpdate(adminId);

      res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const createAdmin = async (req, res) => {
    const { uid } = req.params;
    const { adminId } = req.body;

    const admin = await dao.getAdmin(adminId);
    const user = await userDao.findUserById(uid);

    if (!admin || !user) {
      res.status(401).json({ error: "User or admin does not exist" });
      return;
    }

    await dao.createAdmin(uid);
    await userDao.makeAdmin(uid);

    res.sendStatus(200);
  };

  const deleteAdmin = async (req, res) => {
    const { uid } = req.params;
    const { adminId } = req.body;

    const admin = await dao.getAdmin(adminId);
    const user = await userDao.findUserById(uid);

    if (!admin || !user) {
      res.status(401).json({ error: "User or admin does not exist" });
      return;
    }

    await dao.deleteAdmin(uid);
    await userDao.removeAdmin(uid);

    res.sendStatus(200);
  };

  const updateLootboxPrice = async (req, res) => {
    const { lootboxId } = req.params;
    const { adminId, price } = req.body;

    const admin = await dao.getAdmin(adminId);

    if (!admin) {
      res.status(401).json({ error: "Admin does not exist" });
      return;
    }

    await lootboxDao.updateLootboxPrice(lootboxId, price);
    await dao.updateLastUpdate(adminId);

    res.sendStatus(200);
  };

  const getUsersMatchingSearch = async (req, res) => {
    const { adminId, searchCriteria } = req.params;

    const admin = await dao.getAdmin(adminId);

    if (!admin) {
      res.status(401).json({ error: "Admin does not exist" });
      return;
    }

    const allUsers = await userDao.findAllUsers();
    const users = allUsers.filter((user) => {
      return (
        user.email.includes(searchCriteria) ||
        user.firstName.includes(searchCriteria) ||
        user.lastName.includes(searchCriteria)
      );
    });
    await dao.updateLastUpdate(adminId);

    res.json(users);
  };

  // Define Routes
  app.get("/api/admin/:adminId", getAdmin);
  app.put("/api/admin/users/coins/:uid", updateUserCoins);
  app.put("/api/admin/strava/:uid", resetUserStravaSync);
  app.post("/api/admin/:uid", createAdmin);
  app.delete("/api/admin/:uid", deleteAdmin);
  app.put("/api/admin/lootbox/:lootboxId", updateLootboxPrice);
  app.get("/api/admin/users/:adminId/:searchCriteria", getUsersMatchingSearch);
}
