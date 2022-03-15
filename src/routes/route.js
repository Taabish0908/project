const express = require('express');
const authorController = require('../controllers/authorController')
const blogsController = require('../controllers/blogsController')
const auth = require("../middleware/auth")
const router= express.Router();



router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogsController.createBlog)
router.get("/blogs/:authorId", blogsController.getBlogs)
router.put("/blogs/:blogId", blogsController.updateBlog)
router.delete("/deleteBlog/:blogId", blogsController.deleteBlog)
router.delete("/deletebyQuery", blogsController.deletebyQuery)
router.post("/login", authorController.loginUser)



module.exports =router