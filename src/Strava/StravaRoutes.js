import { authMiddleware } from "../authMiddleware.js";
import * as dao from "./strava-dao.js";
import dotenv from "dotenv";
import request from "request";
import querystring from "querystring";

dotenv.config({ path: "../.env" });

const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = process.env.STRAVA_REDIRECT_URI;
const auth_link = "https://www.strava.com/api/v3/oauth/token";

export default function StravaRoutes(app) {
  const loginRoute = async (req, res) => {
    const scope = "activity:read_all";
    if (client_id) {
      const params = new URLSearchParams({
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: "code",
        approval_prompt: "auto",
        scope: scope,
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
    // your application requests refresh and access tokens
    // after checking the state parameter
    const code = req.query.code || null;
    const grant_type = "authorization_code";

    try {
      const authOptions = {
        url: auth_link,
        body: JSON.stringify({
          client_id,
          client_secret,
          code,
          grant_type,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const responseBody = JSON.parse(body);
          const accessToken = responseBody.access_token;
          const refreshToken = responseBody.refresh_token;
          const expiresAt = responseBody.expires_at;
          const stravaId = responseBody.athlete.id;

          res.redirect(
            "http://localhost:3000/#/profile/#" +
              querystring.stringify({
                accessToken,
                refreshToken,
                expiresAt,
                stravaId,
              }),
          );
        } else {
          res.redirect(
            "http://localhost:3000/#/profile/#" +
              querystring.stringify({ error: "invalid_token" }),
          );
        }
      });
    } catch (error) {
      console.error("Error during OAuth:", error);
      res.status(500).json({ error: "Failed to authenticate with Strava" });
    }
  };

  const refreshToken = async (req, res) => {
    const refresh_token = req.query.refresh_token;
    try {
      const authOptions = {
        url: auth_link,
        body: JSON.stringify({
          client_id,
          client_secret,
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token;
          res.send({
            access_token: access_token,
          });
        }
      });
    } catch (error) {
      console.error("Error during OAuth:", error);
      res.status(500).json({ error: "Failed to authenticate with Strava" });
    }
  };

  // For when the user first connects their Strava account
  const createStravaUser = async (req, res) => {
    const { userId } = req.params;

    const body = {
      _id: userId,
      stravaId: req.body.stravaId,
      accessToken: req.body.accessToken,
      refreshToken: req.body.refreshToken,
      expiresAt: req.body.expiresAt,
    };
    try {
      const user = await dao.createStravaUser(body);

      if (!user) {
        res.sendStatus(400);
        return;
      }

      res.json(user);
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ error: "Duplicate user ID" });
      } else {
        // Handle other errors
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  const getStravaUser = async (req, res) => {
    const { userId } = req.params;
    const user = await dao.findStravaUserById(userId);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.json(user);
  };

  const updateStravaUser = async (req, res) => {
    const { userId } = req.params;
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;
    const expiresAt = req.body.expiresAt;
    const response = {};

    try {
      if (accessToken) {
        const result = await dao.updateAccessToken(userId, accessToken);
        response = {
          ...response,
          accessToken: result,
        };
      }
      if (refreshToken) {
        const result = await dao.updateRefreshToken(userId, refreshToken);
        response = {
          ...response,
          refreshToken: result,
        };
      }
      if (expiresAt) {
        const result = await dao.updateExpiresAt(userId, expiresAt);
        response = {
          ...response,
          expiresAt: result,
        };
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    res.json(response);
  };

  // const getStravaCredentials = async (req, res) => {
  //   const { userId } = req.params;
  //   const user = await dao.findStravaUserById(userId);

  //   if (!user) {
  //     res.sendStatus(404);
  //     return;
  //   }

  //   res.json({
  //     accessToken: user.accessToken,
  //     refreshToken: user.refreshToken,
  //     expiresAt: user.expiresAt,
  //   });
  // };

  // All the Strava routes will be authenticated
  app.use("/api/strava", (req, res, next) => {
    console.log("Strava route hit");
    console.log("req.path", req.path);
    if (req.path !== "/callback" && req.path !== "/refresh_token") {
      authMiddleware(req, res, next);
    } else {
      next();
    }
  });

  // Integration Routes
  app.get("/api/strava/login", loginRoute);
  app.get("/api/strava/callback", callback);
  app.post("api/strava/refresh_token", refreshToken);

  // Define Routes
  app.post("/api/strava/:userId", createStravaUser);
  app.get("/api/strava/:userId", getStravaUser);
  // Anything needed to update is present in the body
  app.put("/api/strava/:userId", updateStravaUser);
}
