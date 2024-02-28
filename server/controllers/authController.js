const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//made a register controller
const registerController = async(req,res) => {
    try {
       const existingUser = await userModel.findOne({email:req.body.email}) 
//validation
       if(existingUser){
    return res.status(200).send({
        success:false,
        message:"user already existed "
    })
}
//hash password
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash("B4c0/\/",salt)
req.body.password=hashedPassword
//rest data 
const user = new userModel(req.body)
await user.save()
return res.status(201).send({
    success: true,
    message: "user registered successfully",
    user,
})
} catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while registering",
        })
    }
}

//login call back 
const loginController = async(req,res) => {
    try {
       const user=await userModel.findOne({email:req.body.email})
       if(!user) {
    return res.status(404).send({
        success: false,
        message:"invalid credentials1"
    })   
    } 

//check role
if(user.role !== req.body.role){
    return res.status(500).send({
success: false,
message:"invalid role",
    })
}

    //compare password 
    const comparePassword = bcrypt.compare(req.body.password,user.password )

    if (!comparePassword){
        return res.status(500).send({
            success : false,
            message:"password not matching",
        })
    }
//ab token ki bari 
const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
    expiresIn:'1d',
})
return res.status(200).send({
    success : true,
    message:"login succesfully",
    token,
    user
})
    } 
    
    catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: "Login failed",
        error
      }) 
    }
}


//currentUser controller
const currentUserController = async (req,res) => {
    try {
        const user = await userModel.findOne({_id: req.body.userId});
        return res.status(200).send({
            success:true,
            message: "Current user fetch succesfully ",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
          success: false,
          message:"unable to get current user ",
          error,  
        })
    }
}

module.exports = {registerController,loginController,currentUserController}