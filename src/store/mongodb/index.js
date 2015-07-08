import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: String,
  activities: String
});

const GroupSchema = new mongoose.Schema({
  name: String
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: {
    first: String,
    last: String
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});

const Group = mongoose.model('Group', GroupSchema);
const User = mongoose.model('User', UserSchema);
const Role = mongoose.model('Role', RoleSchema);

export default {User, Group, Role}
