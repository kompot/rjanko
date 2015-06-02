import yup from 'yup';

const Group = yup.object({
  id: yup.number().required(),
  name: yup.string().required('Group name is required')
});

const User = yup.object({
  id: yup.number().required(),
  username: yup.string(),
  name: yup.object({
    first: yup
        .string()
        .required('First name is required'),
    last: yup
        .string()
        .required('Last name is required')
  }),
  dateOfBirth: yup.date().max(new Date(), 'You can not be born in the future!'),
  colorIds: yup.array().of(yup.string()).required('Please select a color'),
  groups: yup.array().of(Group)
});

export default {User, Group};
