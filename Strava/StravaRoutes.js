import dotenv from "dotenv";
import axios from "axios";
import * as dao from "./strava-dao.js";

dotenv.config({ path: "../.env" });

const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = process.env.STRAVA_REDIRECT_URI;
const frontendURL = process.env.FRONTEND_URL;
const auth_link = "https://www.strava.com/api/v3/oauth/token";

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
      const authorization = Buffer.from(client_id + ":" + client_secret).toString("base64");

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

  app.get("/api/strava/connect/:uid", connectUserToStrava);
  app.get("/api/strava/callback", callback);
  app.get("/api/strava/:uid", getStravaId)
}
