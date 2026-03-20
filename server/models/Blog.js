import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: Date,
  author: String
});

export default mongoose.model('Blog', BlogSchema);
