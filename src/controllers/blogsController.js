const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
mongoose = require('mongoose')
// const jwt = require("jsonwebtoken")

// validation functions
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidFor = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    if (typeof value == "object" && Array.isArray(value) == true) return true;
    return false;
};


const createBlog = async function (req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, message: 'invalid request parameter. Please provide blog details' })

        }
        const { title, body, authorId, tags, category, subcategory, isPublished } = data;
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'blog title is required' })
            
        }

        if (!isValid(body)) {
            return res.status(400).send({ status: false, message: 'blog body is required' })
            
        }

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, message: 'author id is required' })
            
        }

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: '${authorId} is not a valid author id ' })
            
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: 'category is required' })
            
        }

        // tags and subcategory could be an array or string
        if (data.hasOwnProperty("tags")) {
            if (!isValidFor(tags)) {
                return res.status(400).send({
                    status: false,message: " Blog tags must be in valid format",}); }}

        if (data.hasOwnProperty("subcategory")) {
            if (!isValidFor(subcategory)) {
                return res.status(400).send({
                    status: false,message: " Blog subcategory is not valid",});  }}

        if (data.hasOwnProperty("isPublished")) {
            if (typeof isPublished != "boolean") {
                return res.status(400).send({ status: false, message: " isPublished should be boolean" });}}
        const blogData = {
            title: title,
            body: body,
            authorId: authorId,
            category: category,
            tags: tags,
            subcategory: subcategory,
            isDeleted: false,
            deletedAt: null,
        };

        // if blog is to be published after creation then publishedAt to be updated as well 
        if (isPublished == true) {
            blogData.isPublished = isPublished; blogData.publishedAt = Date.now();
        } else {
            blogData.isPublished = false;blogData.publishedAt = null;
        }
        const newBlog = await blogsModel.create(blogData)
        res.status(201).send({ status: true, message: 'blog created successfully', data: newBlog })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

    

}
const getBlogs = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true }
        const queryParams = req.query

        if (isValidRequestBody(queryParams)) {
            const { authorId, category, tags, subcategory } = queryParams

            if (isValid(authorId) && isValidObjectId(authorId)) {
                filterQuery['authorId'] = authorId
            }

            if (queryParams.hasOwnProperty("category")) {
                if (!isValid(category)) {
                    return res.status(400).send({status: false,message: " Blog category should be in valid format",});}
                filterQuery["category"] = category.trim();
            }

            // If tags and subcategory are an array then validating each element
            if (queryParams.hasOwnProperty("tags")) {
                if (Array.isArray(tags)) {
                    for (let i = 0; i < tags.length; i++) {
                        if (!isValid(tags[i])) {
                            return res.status(400).send({status: false,message: " Blog tags must be in valid format",});}
                        filterQuery["tags"] = tags[i].trim();
                    }
                } else {
                    if (!isValid(tags)) {
                        return res.status(400).send({status: false,message: " Blog tags must be in valid format", });}
                    filterQuery["tags"] = tags.trim();
                }
            }

            if (queryParams.hasOwnProperty("subcategory")) {
                if (Array.isArray(subcategory)) {
                    for (let i = 0; i < subcategory.length; i++) {
                        if (!isValid(subcategory[i])) {
                            return res.status(400).send({status: false, message: " Blog subcategory is not valid",});}
                        filterQuery["subcategory"] = subcategory[i].trim();
                    }
                } else {
                    if (!isValid(subcategory)) {
                        return res.status(400).send({status: false, message: " Blog subcategory is not valid",});}
                    filterQuery["subcategory"] = subcategory.trim();
                }
            }

            //     if(isValid(subcategory)){

            //         filterQuery['subCategory'] = subcategory.trim()
            //     }
            // }

            const blogs = await blogsModel.find(filterQuery)

            if (Array.isArray(blogs) && blogs.length === 0) {
                return res.status(404).send({ status: false, message: "no such blog found" })

            }
            res.status(200).send({ status: true, message: 'Blog List', data: blogs })

        }
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: "failed", message: err.message })
    }


}

const updateBlog = async function (req, res) {
    try {
        const blogId = req.params["blogId"];
        const requestBody = req.body;
        const queryParams = req.query;

        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false, message: "Blog details are required for update",
            });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: "Enter a valid blogID" });
        }

        const blogByBlogId = await blogsModel.findOne({_id: blogId,isDeleted: false,deletedAt: null, });

        if (!blogByBlogId) {
            return res.status(404).send({ status: false, message: `no blog found by ${blogId}` });
        }
        // using destructuring 
        const { title, body, tags, subcategory } = requestBody;

        // update object has been created with two properties. if updating key is a to be replaced && 
        // type is string then will be added to $set and if it is to be added && type 
        // is an array then will be added to $addToSet

        const update = {$set: { isPublished: true, publishedAt: Date.now() },$addToSet: {}, };

        if (requestBody.hasOwnProperty("title")) {
            if (!isValid(title)) {
                return res.status(400).send({status: false, message: " Blog title should be in valid format",})}
            update.$set["title"] = title.trim();
        }

        if (requestBody.hasOwnProperty("body")) {
            if (!isValid(body)) {
                return res.status(400).send({status: false, message: " Blog body should be in valid format",}); }
            update.$set["body"] = body.trim();
        }

        if (requestBody.hasOwnProperty("tags")) {
            if (Array.isArray(tags)) {
                for (let i = 0; i < tags.length; i++) {
                    if (!isValid(tags[i])) {
                        return res.status(400).send({ status: false, message: " Blog tags must be in valid format", });
                    }
                }
                update.$addToSet["tags"] = { $each: tags };
            } else {
                if (!isValid(tags)) {
                    return res.status(400).send({ status: false, message: " Blog tags must be in valid format", });
                }
                update.$addToSet["tags"] = tags.trim();
            }
        }

        if (requestBody.hasOwnProperty("subcategory")) {
            if (Array.isArray(subcategory)) {
                for (let i = 0; i < subcategory.length; i++) {
                    if (!isValid(subcategory[i])) {
                        return res.status(400).send({ status: false, message: " Blog subcategory is not valid", });} }
                update.$addToSet["subcategory"] = { $each: subcategory };
            } else {
                if (!isValid(subcategory)) {
                    return res.status(400).send({status: false, message: " Blog subcategory is not valid",});}
                update.$addToSet["subcategory"] = subcategory.trim();}}

        const updatedBlog = await blogsModel.findOneAndUpdate({ _id: blogId, isDeleted: false, deletedAt: null },update,{ new: true });

        return res.status(200).send({status: true,message: "Blog updated successfully",data: updatedBlog,});
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}

const deleteBlog = async function (req, res) {
    try {
        const requestBody = req.body;
        const queryParams = req.query;
        const blogId = req.params.blogId;

        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        if (isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "data is not required inside request body", });
        }

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, message: `${id} is not a valid blogID` });
        }

        const findblog = await blogsModel.findOne({ _id: blogId, isDeleted: false, deletedAt: null, });

        if (!findblog) {
            return res.status(404).send({ status: false, message: `no blog found by ${blogId}` });
        }

        const deletedblog = await blogsModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, message: "Blog successfully deleted" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const deletebyQuery = async function (req, res) {
    try {

        let data = req.query;
        // creating an object
        let query = { isDeleted: false };

        if (Object.keys(data).length == 0) {
            //checking the length of data that it should not be undefined
            return res.status(400).send({ status: false, message: "please provide something in the query " });
        } else {
            if (data.tags) { data.tags = { $in: data.tags }; }

            if (data.subcategory) {
                data.subcategory = { $in: data.subcategory };
            }


            query["$or"] = [{ authorId: data.authorId }, { tags: data.tags }, { category: data.category }, { subcategory: data.subcategory }];
        }

        // check if there is any data in query object
        const filteredData = await blogsModel.find(query).count();
        if (filteredData == 0) {
            return res.status(404).send({ status: false, message: " Sorry !!! data not found" });
        }

        // perform delete here using update many 
        const deleteData = await blogsModel.updateMany(query, { $set: { isDeleted: true } });
        res.status(200).send({ status: true, message: 'the requested blog is deleted successfully' });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }

}



module.exports.createBlog = createBlog
module.exports.getBlogs = getBlogs
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletebyQuery = deletebyQuery
