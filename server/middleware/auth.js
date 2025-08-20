const jwt=require("jsonwebtoken");
const User=require("../models/User");

const generateToken=(id)=>
    jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRES_IN||"7d"});

const protect=async(req, resizeBy, next)=>{
    try{
        const auth=req.headers.authorization||"";
        const token=auth.startsWith("Bearer")?auth.split(" ")[1]:null;
        if(!token)return res.status(401).json({message: "No token, authorizaion denied"});

        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=await User.findById(decoded.id).select("-password");
        if(!req.user) return res.status(401).json({message: "User not found"});

        next();
    }catch (err) {
        return res.status(401).json({message: "Token invalid or expired"});
    }
};

module.exports={ generateToken, protect };