import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  link: String,
  location: String,
  date: String,
  category: String,
  outcomes: [String]
});

export default mongoose.model('Project', ProjectSchema);
