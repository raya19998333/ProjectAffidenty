// models/SystemNote.js
import mongoose from 'mongoose';

const SystemNoteSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, default: 'info' }, // info, warning, error
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'system_notes' }
);

export default mongoose.model('SystemNote', SystemNoteSchema);
