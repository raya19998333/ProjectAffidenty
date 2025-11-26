import mongoose from "mongoose";
const sessionSchema = new mongoose.Schema({
  teacherId: mongoose.Schema.Types.ObjectId,
  sessionName: String,
  sessionTime: String,
  sessionRoom: String,
  sessionDate: String,
  sessionCode: String, // Example → X92KD
});
export default mongoose.model("Session", sessionSchema);
