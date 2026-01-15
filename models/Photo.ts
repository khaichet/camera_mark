import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Photo || mongoose.model('Photo', photoSchema, 'photos');
