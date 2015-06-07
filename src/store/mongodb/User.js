import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: String,
  name: {
    first: String,
    last: String
  }
});

export const User = mongoose.model('User', UserSchema);
