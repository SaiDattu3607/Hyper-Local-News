import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  content: { type: String, default: '' },
  link: { type: String, required: true, unique: true, trim: true },
  source: { type: String, default: 'Google News', trim: true },
  state: {
    type: String,
    enum: ['Telangana', 'Andhra Pradesh', 'Unknown'],
    default: 'Unknown'
  },
  district: { type: String, default: 'General', trim: true },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

newsArticleSchema.index({ publishedAt: -1 });
newsArticleSchema.index({ state: 1, district: 1, publishedAt: -1 });

export default mongoose.model('NewsArticle', newsArticleSchema);
