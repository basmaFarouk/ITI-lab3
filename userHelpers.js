const fs = require('fs')
// some
// find
const validateUser = async (req, res, next) =>{
    try {
        const {username , password} = req.body;
        if(!username) return next({status:422,message:"username is required"});
        if(!password) return next({status:422,message:"password is required"});
        const datas = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const userss = JSON.parse(datas)
        const UsernameExists = userss.some(user=>user.username===username)
        if(UsernameExists && req.method == "POST") return next({status:422,message:"username is used"});
        next()
    } catch (error) {
        // next("Validation error")
        next({status:500, internalMessage:error.message})
    }
}



// const validateUser= async(req, res, next)=>{
//     const {username , password}= req.body;
//     if(!username) return res.status(422).send({message:"username is required"});
//     if(!password) return res.status(422).send({message:"password is required"});
//     const data = await fs.promises.readFile("./user.json", {encoding:"utf8"})
//     const users = JSON.parse(data)
//     const isUsername = users.some(user=>user.username===username)
//     if(isUsername) return res.status(422).send({message:"username is used"})
//     next()
// }

module.exports = {
    validateUser,
}