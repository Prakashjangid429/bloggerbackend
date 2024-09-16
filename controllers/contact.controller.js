const Contact = require("../models/Contact.model");

exports.createContact = async (req, res) => {
    const { full_name,mobile,message,email,company_name} = req.body;
    try {
        const newContact = new Contact({full_name,mobile,message,email,company_name});
        const contact = await newContact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Server error');
    }
};