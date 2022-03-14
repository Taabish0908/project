const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")

const createBlog = async function (req, res) {
    try{
        let data = req.body
    let author_id=req.body.authorId
    if(!author_id){
        return res.send("AuthorId is required")
 } 
    let authorId= await authorModel.findById(author_id)
    if(!authorId){
     return res.send('No author is present with the given id')
 } 
 if(data){
     let savedData=await blogsModel.create(data);
     res.status(201).send({msg: savedData, status: true});
 }else{
     return res.status(400).send({msg: "invalid data"});
 }
 }catch(error){
     return res.status(500).send({msg: "insert data", status:false});
 }
 

}
const getBlogs = async function (req, res) {
    try {
        let authorId = req.query.authorId
        let category = req.query.category
        if (!authorId) {
            res.status(400).send({ status: false, msg: "author id is required" })
        } if (!category){
            res.status(400).send({ status: false, msg: "category is required" })
        }
        let authorData = await blogsModel.find({ authorId: authorId })
        if (!authorData) {
            res.status(404).send({ status: false, msg: "auhtorId not exist" })
        }

        let blogsData = await blogsModel.find({ authorId: authorId, category: category, isDeleted: false, isPublished: false })
        if (!blogsData) {
            res.status(404).send({ status: false, msg: "no blogs found" })
        } else {
            res.status(200).send({ status: true, data: blogsData })
        }
    }
    catch (error) {
        console.log(error)
        res.send({ msg: error.message })
    }
}

const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        let title=req.body.title
        
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blogId is required," })
        }

        let blogsData = await blogsModel.find({ _id: blogId })
        if (!blogsData) {
            res.status(404).send({ status: false, msg: "blogId not exist" })
        } else {
            
            

            await blogsModel.updateOne({ _id: blogId },{title:title})
            let updatedDetails = await blogsModel.find({ _id: blogId })
            res.status(201).send({ status: true, data: updatedDetails })
        }

    }
    catch (error) {
        console.log(error)
        res.send({ msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog