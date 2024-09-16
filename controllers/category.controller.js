const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
    const { name,description} = req.body;

    try {
        const newCategory = new Category({ name,description});
        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server error');
    }
};