const contacts = require('../models/contacts');
const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');
const { error } = require('../scheme/contact');

const getListContacts = async (req, res) => {
        const response = await contacts.listContacts();
        res.json(response); 
}

const getById = async (req, res) => {
    const contactId = req.params.contactId;
    const response = await contacts.getContactById(contactId);
    if (!response) {
        throw HttpError(404, error.message);
    }
    res.json(response);
}

const removeById = async (req, res) => {
    const contactId = req.params.contactId;
    const response = await contacts.removeContact(contactId);
    if (!response) {
        throw HttpError(404, error.message);
    }
    res.json(response);
}

const addNewContact = async (req, res) => {
    const response = await contacts.addContact(req.body)
    res.status(200).json(response);
}

const updateContactById = async (req, res) => {
    const contactId = req.params.contactId;
    const response = await contacts.updateContact(contactId, req.body);
    if (!response) {
        throw HttpError(404, error.message);
    }
    res.json(response);
}

module.exports = {
    getListContacts: ctrlWrapper(getListContacts),
    getById: ctrlWrapper(getById),
    removeById: ctrlWrapper(removeById),
    addNewContact: ctrlWrapper(addNewContact),
    updateContactById:ctrlWrapper(updateContactById)
}