const express = require('express');
const authorController = require('../controllers/authorController')
const blogsController = require('../controllers/blogsController')
const router= express.Router();



router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogsController.createBlog)
router.get("/blogs", blogsController.getBlogs)
router.put("/blogs/:blogId", blogsController.updateBlog)



module.exports =router