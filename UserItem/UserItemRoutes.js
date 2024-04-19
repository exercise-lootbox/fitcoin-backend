import * as userItemDao from "./useritem-dao.js";

export default function UserItemRoutes(app) {
  const createUserItem = async (req, res) => {
    try {
      const userItem = req.body;
      const newUserItem = await userItemDao.createUserItem(userItem);
      res.json(newUserItem);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getUserItems = async (req, res) => {
    try {
      const userItems = await userItemDao.getUserItems();
      res.json(userItems);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getUserItem = async (req, res) => {
    try {
      const { userItemId } = req.params;
      const userItem = await userItemDao.getUserItem(userItemId);
      res.json(userItem);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getUserItemsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const userItems = await userItemDao.getItemsByUserId(userId);
      res.json(userItems);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const sellItem = async (req, res) => {
    try {
      const { userItemId, userId, itemId } = req.body;
      const result = await userItemDao.sellItem(userItemId, userId, itemId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  app.post("/api/useritems", createUserItem);
  app.get("/api/useritems", getUserItems);
  app.get("/api/useritems/:userItemId", getUserItem);
  app.get("/api/useritems/user/:userId", getUserItemsByUser);
  app.post("/api/useritems/sell", sellItem);
}
