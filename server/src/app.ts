import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import passport from "./config/passport"
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./routes";
import {errorMiddleware} from "./middleware/error.middleware";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get('/health', (req,res)=> {
  res.status(200).json({status: 'OK', timestamp: new Date().toISOString()});
});

app.use('/api', routes);

app.use(errorMiddleware);

export default app;

