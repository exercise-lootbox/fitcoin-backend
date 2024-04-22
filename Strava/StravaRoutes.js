import dotenv from "dotenv";
import axios from "axios";
import * as dao from "./strava-dao.js";
import * as userDao from "../Users/user-dao.js";
import { authMiddleware } from "../authMiddleware.js";

dotenv.config({ path: "../.env" });

const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = process.env.STRAVA_REDIRECT_URI;
const frontendURL = process.env.FRONTEND_URL;
const auth_link = "https://www.strava.com/api/v3/oauth/token";
const activities_link = "https://www.strava.com/api/v3/athlete/activities";
const ONE_DAY_SECONDS = 7 * 24 * 60 * 60;

// Updates the user's Strava auth tokens if they are expired.
export async function refreshAccessTokenIfNeeded(stravaUser) {
  const expiresAt = stravaUser.expiresAt;
  const nowInSeconds = Math.round(Date.now() / 1000);
  const userId = stravaUser._id;

  if (expiresAt >= nowInSeconds) {
    // No refresh needed
    return stravaUser;
  }

  // Refresh the access token
  const requestBody = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: "refresh_token",
    refresh_token: stravaUser.refreshToken,
  };
  const authorization = Buffer.from(client_id + ":" + client_secret).toString(
    "base64",
  );

  const response = await axios.post(auth_link, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authorization}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Failed to refresh access token");
  }

  const responseBody = response.data;

  await dao.updateAccessToken(userId, responseBody.access_token);
  await dao.updateRefreshToken(userId, responseBody.refresh_token);
  await dao.updateExpiresAt(userId, responseBody.expires_at);

  return await dao.findStravaUserById(userId);
}

export default function StravaRoutes(app) {
  // Redirects the user to the Strava OAuth page
  const connectUserToStrava = async (req, res) => {
    const userId = req.params.uid;

    if (client_id) {
      const params = new URLSearchParams({
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: "code",
        approval_prompt: "auto",
        scope: "activity:read_all",
        // Store userId in the state so we get it once the callback is called by Strava
        state: userId,
      });
      res.json({
        redirectURL:
          "https://www.strava.com/api/v3/oauth/authorize?" + params.toString(),
      });
    } else {
      res.json({ error: "Client ID not found" });
    }
  };

  const callback = async (req, res) => {
    // This is called by Strava once the user signs in through the Strava page
    const authError = req.query.error || null;

    if (authError) {
      res.redirect(frontendURL);
      return;
    }

    const code = req.query.code;
    const userId = req.query.state;

    try {
      const requestBody = {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: "authorization_code",
      };
      const authorization = Buffer.from(
        client_id + ":" + client_secret,
      ).toString("base64");

      const response = await axios.post(auth_link, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authorization}`,
        },
      });

      if (response.status !== 200) {
        res.redirect(frontendURL);
        return;
      }

      // Now that we have confirmed OAuth with Strava, we can
      // add their strava info to the database
      const responseBody = response.data;
      const stravaId = responseBody.athlete.id;

      const stravaUser = {
        _id: userId,
        stravaId: stravaId,
        accessToken: responseBody.access_token,
        refreshToken: responseBody.refresh_token,
        expiresAt: responseBody.expires_at,
      };

      await dao.createStravaUser(stravaUser);
      res.redirect(frontendURL + "/integrations/strava/redirect");
    } catch (error) {
      console.error("Error during OAuth:", error);
      res.status(500).json({ error: "Failed to authenticate with Strava" });
    }
  };

  const getStravaId = async (req, res) => {
    const { uid } = req.params;
    const stravaUser = await dao.findStravaUserById(uid);

    if (!stravaUser) {
      res.sendStatus(404);
      return;
    }

    res.json(stravaUser.stravaId);
  };

  const getRecentActivities = async (req, res) => {
    const { stravaId } = req.params;
    const lastSyncedAt = await dao.getLastSyncedAt(stravaId);
    const nowInSeconds = Math.round(Date.now() / 1000);

    if (lastSyncedAt && nowInSeconds - lastSyncedAt < ONE_DAY_SECONDS) {
      // Just return the user's most recent activities
      const recentActivities = await dao.getRecentActivities(stravaId);
      const recentCoinsGained = await dao.getRecentCoinsGained(stravaId);
      res.json({
        recentActivities: recentActivities,
        coinsGained: recentCoinsGained,
        nextRefresh: lastSyncedAt + ONE_DAY_SECONDS,
      });
    } else {
      // Sync the user's activities from Strava
      let stravaUser = await dao.findStravaUserByStravaId(stravaId);
      try {
        stravaUser = await refreshAccessTokenIfNeeded(stravaUser);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to refresh access token: " + error.message });
        return;
      }
      // Grab the activities from Strava
      const params = new URLSearchParams({
        before: nowInSeconds,
        after: lastSyncedAt || nowInSeconds - ONE_DAY_SECONDS,
      });

      const config = {
        headers: { Authorization: `Bearer ${stravaUser.accessToken}` },
      };

      const response = await axios.get(
        activities_link + "?" + params.toString(),
        config,
      );

      if (response.status !== 200) {
        res.status(500).json({ error: "Failed to fetch activities" });
        return;
      }

      let coinsGained = 0;
      const newActivities = response.data;

      const dbActivities = newActivities.map((activity) => {
        const distance = activity.distance;
        const movingSeconds = activity.moving_time;
        const elevation = Math.abs(activity.elev_high - activity.elev_low);
        const coins = calculateCoins(distance, movingSeconds, elevation);
        coinsGained += coins;

        return {
          id: activity.id,
          activityName: activity.name,
          activityType: activity.type,
          activityStartDate: activity.start_date_local,
          distance: distance,
          movingTime: movingSeconds,
          elevation: elevation,
          coins: coins,
        };
      });

      await dao.updateRecentActivities(stravaId, dbActivities);
      await dao.updateLastSyncedAt(stravaId, nowInSeconds);
      await dao.updateRecentCoinsGained(stravaId, coinsGained);

      const userId = stravaUser._id;
      const currentCoins = await userDao.getCoins(userId);
      const newCoins = currentCoins + coinsGained;
      await userDao.updateCoins(userId, newCoins);

      res.json({
        recentActivities: dbActivities,
        coinsGained: coinsGained,
        nextRefresh: nowInSeconds + ONE_DAY_SECONDS,
      });
    }
  };

  function calculateCoins(distance, movingSeconds, elevation) {
    return Math.round(
      250 + (2 * movingSeconds) / 60 + (100 * distance) / 1000 + elevation / 10,
    );
  }
  
  const getSpecificActivity = async (req, res) => {
    const { stravaId, activityId } = req.params;
    
    const nowInSeconds = Math.round(Date.now() / 1000);
    // Sync the user's activities from Strava
    let stravaUser = await dao.findStravaUserByStravaId(stravaId);
    try {
      stravaUser = await refreshAccessTokenIfNeeded(stravaUser);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to refresh access token: " + error.message });
      return;
    }
    // Grab the activities from Strava
    const params = new URLSearchParams({
      before: nowInSeconds,
      after: nowInSeconds - ONE_DAY_SECONDS,
    });

    const config = {
      headers: { Authorization: `Bearer ${stravaUser.accessToken}` },
    };

    const response = await axios.get(
      activities_link + "?" + params.toString(),
      config,
    );

    if (response.status !== 200) {
      res.status(500).json({ error: "Failed to fetch activities" });
      return;
    }

    const activity = response.data.filter((activity) => activity.id === parseInt(activityId));

    res.json(activity[0]);
  };

  // Define Authenticated Routes
  app.use("/api/strava/activities/:stravaId", authMiddleware);

  app.get("/api/strava/connect/:uid", connectUserToStrava);
  app.get("/api/strava/callback", callback);
  app.get("/api/strava/:uid", getStravaId);
  app.get("/api/strava/activities/:stravaId", getRecentActivities);
  app.get("/api/strava/activities/:stravaId/:activityId", getSpecificActivity);
}
