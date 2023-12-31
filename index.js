import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import sellerRoutes from "./routes/sellerRoutes.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());

app.use("/api/seller",sellerRoutes);
app.use("/api/user",userRoutes);

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