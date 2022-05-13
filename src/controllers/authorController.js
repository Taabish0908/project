const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")

// validation functions
const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true;
}

const isValidTitle = function (title) {
  return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}



const createAuthor = async function (req, res) {
  try {

    let data = req.body;
    if (!isValidRequestBody(data)) {
      return res.status(400).send({ status: false, message: 'invalid request please provide some data' })

    }
    const { fname, lname, title, email, password } = data;  // object destructing

    if (!isValid(fname)) {
      return res.status(400).send({ status: false, message: 'first name is required' })
      
    }

    if (!isValid(lname)) {
      return res.status(400).send({ status: false, message: 'last name is required' })
      
    }

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: 'title is required' })
      
    }

    if (!isValidTitle(title)) {
      return res.status(400).send({ status: false, message: 'title should be among Mr,Mrs,Miss' })
      
    }

    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
      return res.status(400).send({ status: false, message: 'emai should be a valid email address' })
      
    }


    if (!isValid(password)) {
      return res.status(400).send({ status: false, message: 'password is required' })
      
    }


    const isEmailAlreadyUsed = await authorModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, message: `${email} email is already registered` })
      
    }
    const authorData = { fname, lname, title, email, password }
    const newAuthor = await authorModel.create(authorData);

    return res.status(201).send({ status: true, message: 'author created successfully', data: newAuthor });

  } catch (error) {
    res.status(500).send({ status: "failed", message: error.message })

    
  }
}



const loginAuthor = async function (req, res) {
  try {
    const data = req.body;
    if(!isValidRequestBody(data)) {
      return res.status(400).send({status:false, message:'invalid request parameter. Please provide author details'})
      
    }
    const {email , password } = data;

    if(!isValid(email)) {
      res.status(400).send({status:false, message:'email is required'})
      return
    }

    if(!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
      res.status(400).send({status:false, message:'email should be a valid email address'})
      return
    }

    if(!isValid(password)) {
      res.status(400).send({status:false, message:'password is required'})
      return
    }

    // let username = req.body.email
    // let pass = req.body.password

    if (email && password) {
      let author = await authorModel.findOne({ email, password})
      if (!author)
       return res.status(404).send({ status: false, msg: "please provide valid username or password" })

      let payLoad = { authorId: author._id }
      let secret = "group13"
      let token = jwt.sign(payLoad, secret,{ expiresIn: "6000s" })
      res.status(200).send({ status: true,message:'login successfully', data: token })

    } else {
      return res.status(400).send({ status: false, msg: "Please provide username and password" })
    }
  }
  catch (error) {
    console.log(error)
    res.status(500).send({ msg: error.message })
  }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor