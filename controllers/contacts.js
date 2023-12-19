const contacts = require('../models/contacts');
// const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');
const schema = require('../scheme/contact');

const getListContacts = async (req, res) => {
try {
    const response = await contacts.listContacts();
        res.status(200).json(response); 
} catch (error) {
    console.log(error);
}

        
}

const getById = async (req, res) => {
    try {
        const contactId = req.params.contactId;
    const response = await contacts.getContactById(contactId);
    if (!response) {
         return res.status(404).json({message: 'Not found'});
    }
    res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
    
}

const removeById = async (req, res) => {
    try {
        const contactId = req.params.contactId;
    const response = await contacts.removeContact(contactId);
    if (!response) {
         return res.status(404).json({message: 'Not found'});
    }
    res.status(200).json({
        message: 'contact deleted'
    });
    } catch (error) {
        console.log(error);
    }
    
}

const addNewContact = async (req, res) => {
    try {
        const validationResult = schema.validate(req.body);
        if (validationResult.error) {
             res.status(400).json({message: "missing required name field"});
             return;
        }
    const response = await contacts.addContact(req.body)
    res.status(201).json(response);
    } catch (error) {
        console.log(error);
    }
    
}

const updateContactById = async (req, res) => {
try {
    const validationResult = schema.validate(req.body);
        if (validationResult.error) {
             res.status(400).json({message: "missing fields"});
             return;
        }
    
    const contactId = req.params.contactId;
    const response = await contacts.updateContact(contactId, req.body);
    if (!response) {
          res.status(404).json({message: 'Not found'});
          return;
    }
    res.json(response);
} catch (error) {
    console.log(error)
}

    
}

module.exports = {
    getListContacts: ctrlWrapper(getListContacts),
    getById: ctrlWrapper(getById),
    removeById: ctrlWrapper(removeById),
    addNewContact: ctrlWrapper(addNewContact),
    updateContactById: ctrlWrapper(updateContactById)
}