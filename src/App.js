import express from "express";
import cors from "cors";
import { initializeApp } from "firebase-admin/app";
import "dotenv/config.js";
import mongoose from "mongoose";
import UserRoutes from "./Users/UserRoutes.js";
import StravaRoutes from "./Strava/StravaRoutes.js";
import bodyParser from "body-parser";

// Connect to Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

try {
  mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

initializeApp(firebaseConfig);

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

UserRoutes(app);
StravaRoutes(app);

app.listen(process.env.PORT || 4000);
