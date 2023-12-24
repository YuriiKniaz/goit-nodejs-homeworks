const { model, Schema } = require('mongoose');
const handleMongooseError = require('../helpers/handleMongooseError');

const contactSchema = new Schema(  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
   }, {
  timestamps: true,
  versionKey: false
  })

contactSchema.post('save', handleMongooseError);
const Contact = model('Contact', contactSchema);

module.exports = Contact;