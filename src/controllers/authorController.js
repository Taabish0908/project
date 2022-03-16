const authorModel = require("../models/authorModel")
const jwt =require("jsonwebtoken")

const createAuthor = async function (req, res) {
    
    let data = req.body
    let savedData = await authorModel.create(data)
    res.send({ msg: savedData })


}


const loginAuthor = async function (req, res){
  try{
      let username = req.body.email
      let pass = req.body.password

      if(username && pass){
          let author = await authorModel.findOne({email : username, password: pass})
          if(!author) return res.status(404).send({status: false, msg: "please provide valid username or password"})
          let payLoad = {authorId : author._id}
          let secret = "group13"
          let token = jwt.sign(payLoad, secret )
          res.status(200).send({status: true, data: token})

      }else{
          res.status(400).send({status: false, msg: "Please provide username and password"})
      }
  }
  catch (error) {
      console.log(error)
      res.status(500).send({ msg: error.message })
  }
}


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor