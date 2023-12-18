const contacts = require('../models/contacts');
const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');
const schema = require('../scheme/contact');

const getListContacts = async (req, res) => {
        const response = await contacts.listContacts();
        res.status(200).json(response); 
}

const getById = async (req, res) => {
    const contactId = req.params.contactId;
    const response = await contacts.getContactById(contactId);
    if (!response) {
         throw HttpError(404, "Not Found");
    }
    res.status(200).json(response);
}

const removeById = async (req, res) => {
    const contactId = req.params.contactId;
    const response = await contacts.removeContact(contactId);
    if (!response) {
         throw HttpError(404, "Not Found");
    }
    res.status(200).json({
        message: 'contact deleted'
    });
}

const addNewContact = async (req, res) => {
    const validationResult = schema.conScheme.validate(req.body);
        if (validationResult.error) {
            throw HttpError(400, validationResult.error.message);
        }
    const response = await contacts.addContact(req.body)
    res.status(201).json(response);
}

const updateContactById = async (req, res) => {
    const validationResult = schema.conScheme.validate(req.body);
        if (validationResult.error) {
            throw HttpError(400, validationResult.error.message);
    }
    
    const contactId = req.params.contactId;
    const response = await contacts.updateContact(contactId, req.body);
    if (!response) {
         throw HttpError(404, "Not Found");
    }
    res.json(response);
}

module.exports = {
    getListContacts: ctrlWrapper(getListContacts),
    getById: ctrlWrapper(getById),
    removeById: ctrlWrapper(removeById),
    addNewContact: ctrlWrapper(addNewContact),
    updateContactById: ctrlWrapper(updateContactById)
}