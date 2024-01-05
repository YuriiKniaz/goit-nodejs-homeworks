const express = require('express');
const router = express.Router();
const controller = require('../../controllers/contacts');
const contactValidation = require('../../middlewares/contactValidation');
const authenticate = require('../../helpers/authenthicate');
const {conScheme, favoriteScheme} = require('../../scheme/contact');
const isValid = require('../../middlewares/isValidId');

router.get('/', controller.getListContacts);

router.get('/:contactId', isValid, authenticate, controller.getById);

router.post('/', contactValidation(conScheme), authenticate, controller.addNewContact);

router.delete('/:contactId', isValid, authenticate, controller.removeById);

router.put('/:contactId', isValid, authenticate, contactValidation(conScheme), controller.updateContactById);

router.patch('/:contactId/favorite', isValid, authenticate, contactValidation(favoriteScheme), controller.updateStatusContact);

module.exports = router;
