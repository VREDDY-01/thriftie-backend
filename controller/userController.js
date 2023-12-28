import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userLogin = async (req,res)=>{
    const {email,password} = req.body;
    const errors = {usernameError:String,passwordError:String};
    try {
        const existinguser = await User.findOne({email});
        if(!existinguser){
            errors.usernameError = "user Not Found!";
            return res.status(404).json(errors);
        }
        const isPassCorrect = await bcrypt.compare(
            password,
            existinguser.password
        );
        if(!isPassCorrect){
            errors.passwordError = "Invalid Credentials";
            return res.status(401).json(errors);
        }
        const token = jwt.sign({
            email,
            id:existinguser._id
        },process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).json({result:existinguser,usertoken:token})
    } catch (error) {
        console.log(error);
    }
};

export const userSignup = async (req,res)=>{
    try{
        const {name,email,password,contactNumber,dob,avatar} = req.body;
        const errors = {emailError:String};
        const existingusermail = await User.findOne({email});
        const existingusernum = await User.findOne({contactNumber});
        if(existingusermail || existingusernum){
            errors.emailError = "user Account already exists";
            return res.status(400).json(errors);
        }
        const users = await User.find({});

        let helper;
        if(users.length < 10){
            helper = "00"+users.length.toString();
        }else if(users.length<100 && users.length>9){
            helper = "0"+users.length.toString();
        }else{
            helper = users.length.toString();
        }
        const date = new Date();
        const userComps = ["TF",date.getFullYear(),helper];
        const username = userComps.join("");
        const verified = false;
        const hashedPass = await bcrypt.hash(password,10);
        const newuser = await new User({
            name,
            username,
            email,
            password:hashedPass,
            contactNumber,
            dob,
            avatar,
            verified
        });
        await newuser.save();
        return res.status(201).json({
            success:true,
            message:"user Created Succefully",
            response: newuser
        });
    }catch(error){
        const errors = {backendError:String};
        errors.backendError = error;
        res.status(500).json(errors);
    }
};