const jwt = require('jsonwebtoken')


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            res.status(401).send({ status: false, msg: " token is required" })
        }

        let decodedToken = jwt.verify(token, "functionups-thoriums")
        if (!decodedToken) {
            return res.status(401).status({ status: false, msg: "token is invalid" })
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}


let authorization=function(req,res,next){
    try{
        let authorId=req.params.authorId
        let token = req.headers["x-api-key"]
        if(!authorId) {
            res.status(400).send({status: false, msg: " authorId is required, BAD REQUEST"})
        }

        let decodedToken = jwt.verify(token, "yay")
        if(decodedToken.authorId != authorId){
            return res.status(403).send({status:false,msg:"you are not authorized"})
        }
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ msg: error })
    }
}


module.exports.authentication = authentication
module.exports.authorization= authorization