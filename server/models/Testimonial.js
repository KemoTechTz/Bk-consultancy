import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: String,
  content: String,
  company: String
});

export default mongoose.model('Testimonial', TestimonialSchema);
