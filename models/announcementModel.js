// Models/MainModel.js
import { Schema, model } from 'mongoose';

const announcementSchema = new Schema({
  announcementName: String,
  announcementDetails: String,
  announcementDate: Number,
});

const Announcement = model('Announcement', announcementSchema);

export default Announcement;
