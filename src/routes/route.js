const express = require('express');
const authorController = require('../controllers/authorController')
const blogsController = require('../controllers/blogsController')
const auth = require("../middleware/auth")
const router= express.Router();



router.post("/authors",authorController.createAuthor)
router.post("/blogs",blogsController.createBlog)
router.get("/blogs", blogsController.getBlogs)
router.put("/blogs/:blogId", blogsController.updateBlog)
router.delete("/deleteBlog/:blogId", blogsController.deleteBlog)
router.delete("/deletebyQuery", blogsController.deletebyQuery)


router.post("/login", authorController.loginAuthor)
router.post("/blogs", auth.authenticate, blogsController.createBlog)
router.get("/getblogs", auth.authenticate, blogsController.getBlogs)
router.put("/blogs/:blogId", auth.authenticate, auth.authorise, blogsController.updateBlog)
router.delete("/blogs/:blogId", auth.authenticate, auth.authorise, blogsController.deleteBlog)
router.delete("/blogs", auth.authenticate, blogsController.deletebyQuery)


module.exports =router