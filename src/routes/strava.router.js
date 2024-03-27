import express, { Router, request } from 'express';

import {
  loginRoute,
  callback
  // refreshToken
} from '../controller/strava.api.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const router = Router();

router.use(cors()).use(bodyParser.urlencoded({ extended: true }));

router.get('/login', loginRoute);
router.get('/callback', callback);
// router.get('/refresh_token', refreshToken);

export default router;
