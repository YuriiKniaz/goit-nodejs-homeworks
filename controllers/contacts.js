// const contacts = require('../models/contacts');
// const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');
const {conScheme, favoriteScheme} = require('../scheme/contact');
const Contact = require('../models/contacts');

const getListContacts = async (req, res) => {
try {
    const response = await Contact.find().select("-createdAt -updatedAt");
        res.status(200).json(response); 
} catch (error) {
    console.log(error);
}       
}

const getById = async (req, res) => {
    try {
        const {contactId} = req.params;
        const response = await Contact.findById(contactId);
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
        const {contactId} = req.params;
    const response = await Contact.findOneAndDelete(contactId);
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
        const validationResult = conScheme.validate(req.body);
        if (validationResult.error) {
             res.status(400).json({message: "missing required name field"});
             return;
        }
    const response = await Contact.create(req.body)
    res.status(201).json(response);
    } catch (error) {
        console.log(error);
    }   
}

const updateContactById = async (req, res) => {
try {
    const validationResult = conScheme.validate(req.body);
        if (validationResult.error) {
             res.status(400).json({message: "missing fields"});
             return;
        }
    
    const {contactId} = req.params;
    const searchId = await Contact.findById(contactId);
    const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    
    if (!searchId) {
          res.status(404).json({message: 'Not found'});
          return;
    }
    res.status(200).json(response);
} catch (error) {
    console.log(error)
}   
}

const updateStatusContact = async (req, res) => {
    try {
        const {contactId} = req.params;
        const searchId = await Contact.findById(contactId);
        const validationResult = favoriteScheme.validate(req.body);

        if (validationResult.error) {
             res.status(400).json({message: "Missing field favorite"});
             return;
        }
        if (!searchId) {
          res.status(404).json({message: 'Not found'});
          return;
        }
        const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true })
        if (!response) {
        res.status(404).json({ message: 'Not found' })
        return;
        }
        
    res.status(200).json(response)
    } catch (error) {
        console.log(error);
    } 
}

module.exports = {
    getListContacts: ctrlWrapper(getListContacts),
    getById: ctrlWrapper(getById),
    removeById: ctrlWrapper(removeById),
    addNewContact: ctrlWrapper(addNewContact),
    updateContactById: ctrlWrapper(updateContactById),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}