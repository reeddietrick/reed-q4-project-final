import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    unique: true
  }
});

// Check if the model exists before compiling it
const Org = mongoose.models.Org || mongoose.model('Org', OrgSchema);

export default Org;
