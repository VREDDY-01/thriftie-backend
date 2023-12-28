import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

const PORT = process.env.PORT || 5000;
app.get("/",(req,res)=>{
    res.send("Hello from Thriftie Backend!");
});

async function main(){
    await mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server started on port ${PORT}`);
        })
    })
};

main().catch(err=>console.log(err));