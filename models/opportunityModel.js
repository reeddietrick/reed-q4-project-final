import mongoose from 'mongoose';

// Define the opportunity schema
const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: { type: String, required: true }, // Image URL
    contactInfo: { // Contact Information
        name: { type: String, required: false },
        email: { type: String, required: false },
        phone: { type: String, required: false }
    }
});

// Create the opportunity model
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
