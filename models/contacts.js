// const fs = require('fs/promises')
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => { try {
        const contacts = await fs.readFile(contactsPath, 'utf-8');
        // console.log(contacts);
        return JSON.parse(contacts);
    } catch (error) {
        console.log(error)
    }}

const getContactById = async (contactId) => { try {
        const contacts = await listContacts()
    return contacts.find(con => con.id === contactId) || null;
    } catch (error) {
        console.log(error);
    }}

const removeContact = async (contactId) => {try {
        const contacts = await listContacts()
        const index = contacts.findIndex(con => con.id === contactId);
        if (index === -1) {
            return null;
}
        const [deleted] = contacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
        console.log(contacts);
        return deleted;
        
    } catch (error) {
        console.log(error)
    }}

const addContact = async ({name, email, phone}) => { try {
        const contacts = await listContacts();
        const newContact = {
            id: nanoid(),
            name,
            email,
            phone
        }
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact;
    } catch (error) {
        console.log(error)
    }}

const updateContact = async (contactId, { name, email, phone }) => {
try {
  const contacts = await listContacts();

  const updatedContact = { id: contactId, name, email, phone };

  const index = contacts.findIndex((contact) => contact.id === contactId);
  const newContacts = [...contacts];
  newContacts[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));

  return updatedContact;
} catch (error) {
  console.log(error)
}
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
