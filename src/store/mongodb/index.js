import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  name: String
});

const UserSchema = new mongoose.Schema({
  username: String,
  name: {
    first: String,
    last: String
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }]
});

const Group = mongoose.model('Group', GroupSchema);
const User = mongoose.model('User', UserSchema);

export default {User, Group}
