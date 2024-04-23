import { authMiddleware } from "../authMiddleware.js";
import * as dao from "./user-dao.js";

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);

    if (!user) {
      res.sendStatus(400);
      return;
    }

    res.json(user);
  };

  const findUserById = async (req, res) => {
    const { uid } = req.params;
    const user = await dao.findUserById(uid);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  };

  const buyItem = async (req, res) => {
    try {
      const { uid } = req.params;
      const { itemId, coins } = req.body;

      await dao.buyItem(uid, itemId, coins);
      res.status(200).json({ message: "Item bought" });
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  };

  // Define Authenticated Routes
  app.use("/api/users/:uid", authMiddleware);

  // Define Routes
  app.post("/api/users", createUser);
  app.post("/api/users/buy/:uid/", buyItem);
  app.get("/api/users/:uid", findUserById);
}
