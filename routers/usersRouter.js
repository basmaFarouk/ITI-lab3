const fs = require("fs");
const { validateUser } = require("../userHelpers"); 
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { route } = require("express/lib/application");


router.post("/", validateUser, async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const data = await fs.promises
            .readFile("./user.json", { encoding: "utf8" })
            .then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({ id, username, age, password });
        await fs.promises.writeFile("./user.json", JSON.stringify(data), {
            encoding: "utf8",
        });
        res.send({ id, message: "sucess" });
    } catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
  });


router.post('/login', async (req,res,next)=>{
        try {
        const {username , password} = req.body;
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const check = users.find(user=>(user.username==username) && (user.password == password))
        if(!check){
            return next({status:403, message:"username or password aren't correct"})
        }
        return res.status(200).send({message:"logged suceessfully"})

    } catch (error) {
        // next("Validation error")
        next({status:500, internalMessage:error.message})
    }
})

router.patch('/:id', validateUser,async(req, res, next)=>{

    try{
    const {username, password, age} = req.body
    const oldUser = await fs.promises
    .readFile("./user.json", { encoding: "utf8" })
    .then((data) => JSON.parse(data));
    const newUser = oldUser.map((user)=>{
        if(user.id!==req.params.id) return user;
        return{
            username, password, age, id:user.id
        }
    })
    await fs.promises.writeFile("./user.json", JSON.stringify(newUser), {
        encoding: "utf8",
    });

    res.status(200).send({message:"user edited"})
    }catch (error){
        next({ status: 500, internalMessage: error.message });
    }
})



router.get('/:id', async (req,res,next)=>{
    try {
    const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
    const users = JSON.parse(data)
    const user = users.find((user)=>user.id===req.params.id)
    if(user) return  res.status(200).send(user)
        return next({status:404, message:"user not found"}) 
   
} catch (error) {
    next({status:500, internalMessage:error.message})
}
})

router.delete('/:id', async (req,res,next)=>{
    try {
    const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
    const users = JSON.parse(data)
    const user = users.filter((user)=>user.id!==req.params.id)
    await fs.promises.writeFile("./user.json", JSON.stringify(user), {
        encoding: "utf8",
    });
    res.send("user deleted")
   
} catch (error) {
    // next("Validation error")
    next({status:500, internalMessage:error.message})
}
})




router.get('/', async (req,res,next)=>{
  try {
  const age = Number(req.query.age)
  const users = await fs.promises
  .readFile("./user.json", { encoding: "utf8" })
  .then((data) => JSON.parse(data));
  const filteredUsers = users.filter(user=>user.age===age)
  res.send(filteredUsers)
  } catch (error) {
  next({ status: 500, internalMessage: error.message });
  }

})



module.exports = router;
