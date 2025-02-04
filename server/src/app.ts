import express from 'express';
import cors from 'cors';
import imagesRouter from "./routers/images";

const dotenv = require("dotenv");

dotenv.config()

const CLIENT_1 = process.env.CLIENT_1 || 'http://localhost:5173';
const CLIENT_2 = process.env.CLIENT_2 || 'http://127.0.0.1:5173';

const app = express();

app.use(
    cors({ origin: [CLIENT_1, CLIENT_2] })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(imagesRouter);

export default app;