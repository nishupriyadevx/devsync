const express=require("express");
const User=require("../models/User");

const router=express.Router();

//Route to register a new user
router.post("/register", async(req, res)=>{
    try{
        //get user details from the request body
        const{name, email, password, skills}=req.body;

        //check if a user with the same email already exists
        const existingUser=await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        //create a new user with the provided details
        const newUser=new User({name, email, password, skills});
        await newUser.save();

        //send success response with the new user details
        res.status(201).json({message: "User registered successfully", user: newUser});
    } catch(err){
        //If something goes wrong, send an error response
        res.status(500).json({message: "Error registering user", error: err.message});
    }
});
module.exports=router;