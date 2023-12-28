import mongoose, { Schema } from "mongoose";

const sellerSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require: true,
        },
        email:{
            type: String,
            require: true,
            unique: true
        },
        password:{
            type: String,
            require: true
        },
        username:{
            type: String
        },
        contactNumber:{
            type:Number
        },
        dob:{
            type:String
        },
        avatar:{
            type:String
        },
        verified:{
            type:Boolean,
            default:false,
        },
        products:[
            {
                type:Schema.Types.ObjectId,
                ref:"Product"
            }
        ]
    },{
        timestamps:true
    }
);

export default mongoose.model("seller",sellerSchema);