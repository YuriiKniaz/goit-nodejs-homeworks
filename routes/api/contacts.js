const express = require('express');
const router = express.Router();
const controller = require('../../controllers/contacts');

router.get('/', controller.getListContacts);

router.get('/:contactId', controller.getById);

router.post('/', controller.addNewContact);

router.delete('/:contactId', controller.removeById);

router.put('/:contactId', controller.updateContactById);

module.exports = router
