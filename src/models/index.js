import yup from 'yup';

const debug = require('core/logging/debug')(__filename);

yup.addMethod(yup.mixed, 'label', function(l) {
  this.label = () => l;
  return this;
});

const Group = yup.object({
  _id: yup.string().required(),
  name: yup.string().required('Group name is required')
});

const User = yup.object({
  _id: yup.string().required(),
  username: yup.string().label('Username'),
  name: yup.object({
    first: yup
        .string().label('Имя')
        .required('First name is required'),
    last: yup
        .string().label('Фамилия')
        .required('Last name is required')
  }),
  dateOfBirth: yup.date().max(new Date(), 'You can not be born in the future!'),
  colorIds: yup.array().of(yup.string()).required('Please select a color'),
  groups: yup.array().of(Group)
});

export default {User, Group};
