import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {submitReport} from "../controllers/report/create_report.js";

const reportRouter = express.Router();

reportRouter.post("/submit/:contentId",isAuthenticated,submitReport);

export { reportRouter }