import * as lootboxDao from "./lootbox-dao.js";

export default function LootboxRoutes(app) {
  const getLootboxes = async (req, res) => {
    try {
      const lootboxes = await lootboxDao.findAllLootboxes();
      res.json(lootboxes);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getLootbox = async (req, res) => {
    try {
      const { lootboxId } = req.params;
      const lootbox = await lootboxDao.findLootboxById(lootboxId);
      res.json(lootbox);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  app.get("/api/lootboxes", getLootboxes);
  app.get("/api/lootbox/:lootboxId", getLootbox);
}
