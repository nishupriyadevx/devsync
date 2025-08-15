//Import mongoose to work with MongoDB
const mongoose=require("mongoose");

//define the user schema
const userSchema=new mongoose.Schema(
    {name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    skills: {type: [String], default: []}
    },
    //adds created at and updated at timestamps automatically
    { timestamps: true}
);

module.exports=mongoose.model("User", userSchema);