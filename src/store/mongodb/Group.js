import mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema({
  name: String
});

export const Group = mongoose.model('Group', GroupSchema);
