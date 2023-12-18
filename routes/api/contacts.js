const express = require('express');
const router = express.Router();
const controller = require('../../controllers/contacts');
const contactValidation = require('../../middlewares/contactValidation')
const schema = require('../../scheme/contact')

router.get('/', controller.getListContacts);

router.get('/:contactId', controller.getById);

router.post('/', contactValidation(schema.conScheme), controller.addNewContact);

router.delete('/:contactId', controller.removeById);

router.put('/:contactId', contactValidation(schema.conScheme), controller.updateContactById);

module.exports = router
