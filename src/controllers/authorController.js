const authorModel = require("../models/authorModel")
const jwt =require("jsonwebtoken")

const createAuthor = async function (req, res) {
    
    let data = req.body
    let savedData = await authorModel.create(data)
    res.send({ msg: savedData })


}


const loginUser = async function (req, res) {
    let userName = req.body.email;
    let password = req.body.password;
  
    let author = await authorModel.findOne({ email: userName, password: password });
    if (!author)
      return res.send({
        status: false,
        msg: "username or the password is not correct",
      });
  
    let token = jwt.sign(
      {
    authorId: author._id.toString(),
        batch: "thoriums",
        organisation: "functionUps",
      },
      "functionups-thoriums"
    );
    res.setHeader("x-api-key", token);
    res.send({ status: true, data: token });
  };

module.exports.createAuthor = createAuthor
module.exports.loginUser = loginUser