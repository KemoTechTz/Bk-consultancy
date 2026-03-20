import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: String,
  description: String
});

export default mongoose.model('Service', ServiceSchema);
