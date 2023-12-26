const express = require('express');
const router = express.Router();
const controller = require('../../controllers/contacts');
const contactValidation = require('../../middlewares/contactValidation');
const {conScheme, favoriteScheme} = require('../../scheme/contact');
const isValid = require('../../middlewares/isValidId');

router.get('/', controller.getListContacts);

router.get('/:contactId', isValid, controller.getById);

router.post('/', contactValidation(conScheme), controller.addNewContact);

router.delete('/:contactId', isValid, controller.removeById);

router.put('/:contactId', isValid, contactValidation(conScheme), controller.updateContactById);

router.patch('/:contactId/favorite', isValid, contactValidation(favoriteScheme), controller.updateStatusContact);

module.exports = router
