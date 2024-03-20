import express from "express";
import cors from "cors";
import { authMiddleware } from "./authMiddleware.js";


const app = express()
app.use(cors());
app.use(express.json());

// Specify routes which should be authed like this
app.use("/authtest", authMiddleware);

app.get('/hello', (req, res) => {res.send('Hello World!')})
app.get('/authtest', (req, res) => {res.send(`Authenticated: ${req.user}`)})

app.listen(process.env.PORT || 4000);
