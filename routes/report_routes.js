import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { submitReport } from "../controllers/report/create_report.js";

const reportRouter = express.Router();

// POST route to submit a report for specific content - requires contentId and authentication
reportRouter.post("/submit/:contentId", isAuthenticated, submitReport);

export { reportRouter };
