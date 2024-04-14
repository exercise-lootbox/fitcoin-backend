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

  const updateUser = async (req, res) => {
    const { uid } = req.params;
    const user = await dao.updateUser(uid, req.body);

    if (!user) {
      res.sendStatus(404);
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

  // Define Authenticated Routes
  app.use("/api/users/:uid", authMiddleware);

  // Define Routes
  app.put("/api/users/:uid", updateUser);
  app.post("/api/users", createUser);
  app.get("/api/users/:uid", findUserById);
}
