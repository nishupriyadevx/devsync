//Import required modules
const express=require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const cors=require("cors");

//Import route files
const authRoutes=require("./routes/authRoutes");

const app=express();
const PORT=process.env.PORT||5000;

//Middleware setup
app.use(cors()); //enables Cross-Origin Resource sharing
app.use(express.json()); //parses incoming json requests

//Root route to test the status of server
app.get("/", (req,res)=>{
    res.send("Devsync server is running!");
});

//API routes
app.use("/api/auth", authRoutes);

//connect to mongoose and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true,})
    .then(()=>{
        console.log("MongoDB connected");
        app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`))
    })
    .catch(err=>console.error("MongoDB Connection Error:",err));