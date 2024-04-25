import * as dao from "./spotlight-dao.js";
import * as userDao from "../Users/user-dao.js";

// Helper function for adding a member to the spotlight.
export async function addMemberSpotlight(userId, coinsEarned) {
  const spotlight = await dao.getMemberSpotlight();

  if (spotlight.length >= 5) {
    // Remove the oldest spotlight member
    await dao.removeSpotlightMember(spotlight[0]._id);
  }

  const user = await userDao.findUserById(userId);

  const spotlightMember = {
    userId: userId,
    coinsEarned: coinsEarned,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await dao.addSpotlightMember(spotlightMember);
}

export default function SpotlightRoutes(app) {
  const getSpotlight = async (_req, res) => {
    try {
      const spotlights = await dao.getMemberSpotlight();
      res.json(spotlights);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  };

  app.get("/api/spotlight/", getSpotlight);
}
