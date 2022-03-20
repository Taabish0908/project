const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")


const createBlog = async function (req, res) {
    try{
        let data = req.body
        console.log(data)
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

        let blogsData = await blogsModel.find({ authorId: authorId, category: category, isDeleted: false, isPublished: true })
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

const updateBlog = async function(req,res){
    try{
    let updateBlog = req.params.blogId
    let  = await blogsModel.findById(updateBlog)
  if (!updateBlog) {
    return res.status(404).send({msg:"Invalid Blog",status:false})
  }
  let updatedata = req.body;
  let updatedUser = await blogsModel.findOneAndUpdate({ _id: updateBlog },
    {title : updatedata.title, body:updatedata.body, tags : updatedata.tags,category:updatedata.category, subcategory : updatedata.subcategory},{new : true, upsert : true});
  res.status(202).send({ status: 'Blogs successfully updated', data: updatedUser })
}catch(err){
    res.status(500).send({Error : err.message})
    }
}

const deleteBlog = async function(req,res){
    try{
    let data = req.params.blogId;
    if(!data)
    return res.status(400).send({msg: "blog id needs to be present"})
    
    
    let blog = await blogsModel.findById(data)
    if (!blog) return res.status(404).send({ status: false, msg: "Blog does not exists" })
    
    // for checking if the blog is already deleted
    if (blog.isDeleted == true) return res.status(400).send({ status: false, msg: "Blog is already deleted" })
    let deletedBlog = await blogsModel.findOneAndUpdate({ _id: data },
        { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
    res.status(200).send({status:'The Blog is Successfully deleted'})
    }catch(err){
      res.status(500).send({Error : err.message})
    }
  };

  const deletebyQuery = async function(req,res){
    try{  
        const data = req.query
        
        const blogId = req.query._id
        if (!Object.keys(data).length > 0) return res.status(400).send({ status: false, msg: "Query is required to filter the data" })
        let filterByquery = await blogsModel.find(data)
            if(filterByquery.length == 0){
                return res.status(400).send({msg:"No Blog Not Found with the given Query"})
            }
        // checking if blog is already deleted
        let isDeleted = await blogsModel.findOne({ _id : blogId , isDeleted : true})
       if (isDeleted)return res.status(400).send({ status: false, msg: "Blog is already deleted" })

        // deleting blog
        const deletedBlog = await (blogsModel.updateMany(data, { isDeleted: true, deletedAt: new Date() }, { new: true }))
        if (!deletedBlog) return res.status(404).send({ status: false, msg: "no data found" })
        res.status(200).send({msg : "blog deleted successfully"})
    }catch(err){
        res.status(500).send({Error : err.message})
    }
}



module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletebyQuery = deletebyQuery
