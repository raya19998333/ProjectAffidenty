import mongoose from "mongoose";
const attendanceSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  sessionId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "Present" },
  date: String,
});
export default mongoose.model("Attendance", attendanceSchema);
