import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const sellerLogin = async (req,res)=>{
    const {email,password} = req.body;
    const errors = {usernameError:String,passwordError:String};
    try {
        const existingSeller = await Seller.findOne({email});
        if(!existingSeller){
            errors.usernameError = "Seller Not Found!";
            return res.status(404).json(errors);
        }
        const isPassCorrect = await bcrypt.compare(
            password,
            existingSeller.password
        );
        if(!isPassCorrect){
            errors.passwordError = "Invalid Credentials";
            return res.status(401).json(errors);
        }
        const token = jwt.sign({
            email,
            id:existingSeller._id
        },process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).json({result:existingSeller,sellertoken:token})
    } catch (error) {
        console.log(error);
    }
};

export const sellerSignup = async (req,res)=>{
    try{
        const {name,email,password,contactNumber,dob,avatar} = req.body;
        const errors = {emailError:String};
        const existingSellermail = await Seller.findOne({email});
        const existingSellernum = await Seller.findOne({contactNumber});
        if(existingSellermail || existingSellernum){
            errors.emailError = "Seller Account already exists";
            return res.status(400).json(errors);
        }
        const sellers = await Seller.find({});

        let helper;
        if(sellers.length < 10){
            helper = "00"+sellers.length.toString();
        }else if(sellers.length<100 && sellers.length>9){
            helper = "0"+sellers.length.toString();
        }else{
            helper = sellers.length.toString();
        }
        const date = new Date();
        const selComps = ["SEL",date.getFullYear(),helper];
        const username = selComps.join("");
        const verified = false;
        const hashedPass = await bcrypt.hash(password,10);
        const newSeller = await new Seller({
            name,
            username,
            email,
            password:hashedPass,
            contactNumber,
            dob,
            avatar,
            verified
        });
        await newSeller.save();
        return res.status(201).json({
            success:true,
            message:"Seller Created Succefully",
            response: newSeller
        });
    }catch(error){
        const errors = {backendError:String};
        errors.backendError = error;
        res.status(500).json(errors);
    }
};