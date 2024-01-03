const { model, Schema } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');

const usersSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
})

usersSchema.post('save', handleMongooseError);
const User = model('User', usersSchema);

module.exports = User;