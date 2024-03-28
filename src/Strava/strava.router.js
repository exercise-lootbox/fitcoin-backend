import express, { Router, request } from 'express';

import {
  loginRoute,
  callback
  // refreshToken
} from './strava.api.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  })
);

router.get('/login', loginRoute);
router.get('/callback', callback);
// router.get('/refresh_token', refreshToken);

export default router;
