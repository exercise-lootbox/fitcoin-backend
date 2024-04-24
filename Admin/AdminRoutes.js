import { authMiddleware } from "../authMiddleware.js";
import * as dao from "./admin-dao.js";
import * as userDao from "../Users/user-dao.js";
import * as stravaDao from "../Strava/strava-dao.js";

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

  const addUserCoins = async (req, res) => {
    try {
      const { uid } = req.params;
      const { adminId, coins } = req.body;

      const admin = await dao.getAdmin(adminId);
      const user = await userDao.findUserById(uid);

      if (!admin || !user) {
        res.sendStatus(401).json({ error: "User or admin does not exist" });
        return;
      }

      const newCoins = user.coins + coins;

      await userDao.updateCoins(uid, newCoins);
      await dao.updateLastUpdate(adminId);

      res.json({ coins: newCoins });
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
        res.sendStatus(401).json({ error: "User or admin does not exist" });
        return;
      }

      await stravaDao.resetStravaSync(user.stravaId, 0);
      await dao.updateLastUpdate(adminId);

      res.sendStatus(200);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  };

  const createAdmin = async (req, res) => {
    const { uid } = req.params;
    const { adminId } = req.body;

    const admin = await dao.getAdmin(adminId);
    const user = await userDao.findUserById(uid);

    if (!admin || !user) {
      res.sendStatus(401).json({ error: "User or admin does not exist" });
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
    const user = await userDao.removeAdmin(uid);

    if (!admin || !user) {
      res.sendStatus(401).json({ error: "User or admin does not exist" });
      return;
    }

    await dao.deleteAdmin(uid);
    await userDao.removeAdmin(uid);

    res.sendStatus(200);
  };

  // Define Authenticated Routes
  app.use("/api/admin/", authMiddleware);

  // Define Routes
  app.get("/api/admin/:adminId", getAdmin);
  app.put("/api/admin/users/coins/:uid", addUserCoins);
  app.put("/api/admin/strava/:uid", resetUserStravaSync);
  app.post("/api/admin/:uid", createAdmin);
  app.delete("/api/admin/:uid", deleteAdmin);
}
