import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: String,
  name: {
    first: String,
    last: String
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

export const User = mongoose.model('User', UserSchema);
