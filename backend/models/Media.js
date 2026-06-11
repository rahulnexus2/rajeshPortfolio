import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  fileName: { type: String, required: true, unique: true },
  data: { type: String, required: true }, // Base64 data string
  mimeType: { type: String, required: true },
  size: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Media', MediaSchema);
