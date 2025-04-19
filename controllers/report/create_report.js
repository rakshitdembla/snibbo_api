import { Report } from "../../models/Report.js";
import mongoose from "mongoose";
import { serverError } from "../../utils/server_error_res.js";

export const submitReport = async (req, res) => {
    try {
        const { contentId } = req.params;
        const userId = req.userId;
        const { reportDesc, reportFor } = req.body;

        if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid content id provided."
            });
        }

        if (!reportDesc || !reportFor) {
            return res.status(400).json({
                success: false,
                message: "Report description & for is required in body."
            });
        }

        const report = await Report.create({
            contentId: contentId,
            reportDesc: reportDesc,
            reportFor: reportFor,
            reportedBy: userId,
        });

        const submittedReport = report.toObject();
        delete submittedReport.reportedBy;

        return res.status(202).json({
            success: true,
            message: "Report submitted successfully.",
            submittedReport
        });


    } catch (e) {
        serverError(res, e);
    }
}