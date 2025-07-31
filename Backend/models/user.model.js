import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNo:{
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum:["student","recruiter"],
        requied: true
    },
    profile:{
        bio:{type:String},
        skills:{type:[String]},
        resume:{type:String} ,// it will be url to resume file
        resumeName: {type:String},
        compny: {type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type: String,
            default:""
        }
    }
},{timestamps:true});

export const User = mongoose.model("User", userSchema);