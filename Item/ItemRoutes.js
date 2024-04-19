import * as itemDao from "./item-dao.js";

export default function ItemRoutes(app) {
  const getItems = async (req, res) => {
    try {
      const items = await itemDao.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const item = await itemDao.findItemById(itemId);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  const getBoxItems = async (req, res) => {
    try {
      const { boxId } = req.params;
      const items = await itemDao.findAllItemsByLootbox(boxId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "ERRROR" });
    }
  };

  app.get("/api/items", getItems);
  app.get("/api/items/:itemId", getItem);
  app.get("/api/items/lootbox/:boxId", getBoxItems);
}
