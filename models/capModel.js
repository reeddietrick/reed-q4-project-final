import { Schema, model } from 'mongoose';

const capSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    expandedDescription: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true }, // Image URL
    contactInfo: { // Contact Information
        name: { type: String, required: false },
        email: { type: String, required: false },
        phone: { type: String, required: false }
    }
});

const Cap = model('Cap', capSchema);

export default Cap;
