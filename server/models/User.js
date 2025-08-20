//Import mongoose to work with MongoDB
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

//define the user schema
const userSchema=new mongoose.Schema(
    {name: {type: String, required: true, trim:true},
    email: {type: String, required: true, unique: true, lowercase:true, trim:true},
    password: {type: String, required: true, minLength:6},
    skills: {type: [String], default: []}
    },
    //adds created at and updated at timestamps automatically
    { timestamps: true}
);

//Hash password if modified/new
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt);
    next();    
});

//Compare entered password with hash password
userSchema.methods.matchPassword=function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password);
};

//Remove password from JSON responses
userSchema.methods.toJSON=function(){
    const obj=this.toObject();
    delete obj.password;
    return obj;
};

module.exports=mongoose.model("User", userSchema);