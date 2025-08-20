const express=require("express");
const User=require("../models/User");
const { generateToken, protect }=require("../middleware/auth");

const router=express.Router();

/** 
 * @route POST /api/auth/register
 * @desc  Create a new user account
 * @body  { name, email, password, skills? }
 */

//Route to register a new user
router.post("/register", async(req, res)=>{
    try{
        //get user details from the request body
        const{name, email, password, skills =[] } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        //check if a user with the same email already exists
        const existingUser=await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        //create a new user with the provided details
        const newUser=new User({name, email, password, skills});
        await newUser.save();

        //send success response with the new user details
        return res.status(201).json({ message: "User registered successfully", user: newUser});
    } catch(err){
        //If something goes wrong, send an error response
        return res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

/**
 * @route  POST /api/auth/login
 * @desc   Log in and get JWT
 * @body   { email, password }
 */
router.post("/login", async(req, res)=>{
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user=await User.findOne({ email });
        if (!user) return res.status(400).json({ message:"Invalid credentials" });

        const isMatch=await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token=generateToken(user._id);
        return res.json({ message: "Logged in", token, user });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

/**
 * @route  GET /api/auth/me
 * @desc   Get current user (protected)
 * @header Authorization: Bearer <token>
 */
router.get("/me", protect, async (req,res)=>{
    return res.json({ user: req.user });
});


module.exports=router;