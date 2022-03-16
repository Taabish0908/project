const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")

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
    return res.status(404).send({msg:"Invalid Blog"})
  }
  let updatedata = req.body;
  let updatedUser = await blogsModel.findOneAndUpdate({ _id: updateBlog },{title : updatedata.title, body:updatedata.body, tags : updatedata.tags, subcategory : updatedata.subcategory},{new : true, upsert : true});
  res.status(200).send({ status: true, data: updatedUser })
}catch(err){
    res.status(500).send({Error : err.message})
    }
}

const deleteBlog = async function(req,res){
    try{
    let blogId = req.params.blogId;
    if(!blogId)
    res.send({msg: "blog id needs to be present"})
    let id = await blogsModel.findById(blogId)
    // if (!id) {
    //   return res.status(404).send({ msg: "Is not deleted" });
    // }
    // let blogId = req.params.blogId;
    let userDel = await blogsModel.findOneAndUpdate({_id: blogId},{isDeleted: true},{new:true});
    res.status(200).send({status:true})
    }catch(err){
      res.status(500).send({Error : err.message})
    }
  };

  const deletebyQuery = async function(req,res){
    try{  
            let query = req.query
            let filterByquery = await blogsModel.find(query)
            if(filterByquery.length == 0){
                return res.status(400).send({msg:"Blog Not Found"})
            }
            else{
                let deletedDetails = await blogsModel.updateMany(query, {isDeleted : true, deletedAt: new Date()})
                return res.status(200).send({msg:"data is deleted"})
            }
    }catch(err){
        res.status(500).send({Error : err.message})
    }
}



module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletebyQuery = deletebyQuery
