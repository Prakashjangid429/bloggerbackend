const Blog = require('../models/blog.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');


exports.createBlog = async (req, res) => {
    const { title, content, description, categories, image_url, blog_url } = req.body;

    try {
        const newBlog = new Blog({ title, content, description, categories, image_url, author: req.user.id, blog_url });
        const blog = await newBlog.save();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).send('Server error');
    }
};


exports.getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        let filter = {};
        if (req.user) {
            filter.author = req.user.id;
        }
        if (category) {
            filter.categories = category;
        }
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;
        const blogs = await Blog.find(filter)
            .select(['-content','-description'])
            .populate('author', ['full_name', 'email'])
            .populate('categories', 'name')
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);
        const total = await Blog.countDocuments(filter);
        res.json({
            blogs,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};



exports.getSingle = async (req, res) => {
    const { title } = req.params;
    try {
        const blog = await Blog.findOne({ blog_url: title })
            .populate('author', ['full_name', 'email'])
            .populate('categories', 'name');
        if (!blog) {
            return res.status(404).json({ msg: 'Blog not found' });
        }
        blog.view_count = (blog.view_count || 0) + 1;
        await blog.save();
        res.json({ blog });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.blogCounter = async (req, res) => {
    try {
        const count = await Blog.aggregate([
            { $unwind: "$categories" },
            { $group: { _id: "$categories", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    categoryName: "$categoryDetails.name",
                    count: 1
                }
            },
            {
                $facet: {
                    totalCount: [{ $count: "totalBlogs" }],
                    categoryCounts: [{ $match: {} }]
                }
            },
            {
                $project: {
                    categoryCounts: "$categoryCounts",
                    totalCount: { $arrayElemAt: ["$totalCount.totalBlogs", 0] }
                }
            },
            {
                $addFields: {
                    categoryCounts: {
                        $concatArrays: [
                            [
                                {
                                    categoryId: "all",
                                    categoryName: "All",
                                    count: "$totalCount"
                                }
                            ],
                            "$categoryCounts"
                        ]
                    }
                }
            },
            { $project: { totalBlogs: "$totalCount", categoryCounts: 1 } }
        ])
        res.json(count);
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


exports.updateBlog = async (req, res) => {
    const { title,description , blog_url , content } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.description = description || blog.description;
        blog.blog_url = blog_url || blog.blog_url;

        await blog.save();
        res.status(201).json(blog);

    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized' });
        }
        await blog.remove();
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
