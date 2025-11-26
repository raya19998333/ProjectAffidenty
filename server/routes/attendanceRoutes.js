import express from "express";
import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
const router = express.Router();
// ========== Student enters session code ==========
router.post("/mark-attendance", async (req, res) => {
  const { studentId, code } = req.body;
  const session = await Session.findOne({ sessionCode: code });
  if (!session)
    return res.json({ success: false, message: "Invalid session code" });
  // check if already marked
  const exists = await Attendance.findOne({
    studentId,
    sessionId: session._id,
  });
  if (exists) return res.json({ success: false, message: "Already marked" });
  const att = await Attendance.create({
    studentId,
    sessionId: session._id,
    date: new Date().toISOString().split("T")[0],
  });
  res.json({ success: true, attendance: att, session });
});
// ========== Student History ==========
router.get("/:studentId/history", async (req, res) => {
  const { studentId } = req.params;
  const history = await Attendance.find({ studentId }).populate("sessionId");
  res.json(history);
});
export default router;
