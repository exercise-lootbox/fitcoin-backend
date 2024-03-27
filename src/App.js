import express from 'express';
import cors from 'cors';
import { authMiddleware } from './authMiddleware.js';
import { initializeApp } from 'firebase-admin/app';
import 'dotenv/config.js';
import stravaRouter from './routes/strava.router.js';

// Connect to Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

initializeApp(firebaseConfig);

const app = express();
app.use(cors());
app.use(express.json());

// Specify routes which should be authed like this
app.use('/authtest', authMiddleware);

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});
app.get('/authtest', (req, res) => {
  res.send('Authenticated! UserId: ' + req.user.uid);
});

app.use('/api/strava', stravaRouter);

app.listen(process.env.PORT || 4000);
