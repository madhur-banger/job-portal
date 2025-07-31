import {Company} from "../models/company.model.js"
import mongoose from "mongoose";

// TODO: Register Company 
export const registerCompany = async (req,res)  =>{
    try {
        const { companyName, description, website, location, logo } = req.body;
        if(!companyName){
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        };
        const existingCompany = await Company.findOne({ name: companyName });

        if (existingCompany) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }
        const newCompany = await Company.create({
            name: companyName,
            description,
            website,
            location,
            logo,
            userId: req.id
        });
        return res.status(200).json({
            message: "Company registered successfully",
            success: true,
            data: newCompany
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Internal Server Error: ${error.message || error}`,
            success: false
        });
    };
};

// TODO: GET company by UserId

export const getCompany = async (req,res) => {
    try {
        const userId = req.id; //logged in user id
        const companyName = await Company.findOne({userId});

        if(!companyName){
            return res.status(404).json({
                message: "Compnay not found"
            });
        };

        return res.status(200).json({
            message: companyName,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Internal Server Error: ${error.message || error}`,
            success: false
        });
    };
};


// TODO : GET Company by companyId

export const getCompanyById = async (req,res) => {
    try {
        const companyId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(companyId)){
            return res.status(400).json({
                message: "Invalid company ID",
                success: false
            });
        }
        
        const company = await Company.findById(companyId);

        if(!company){
            return res.status(400).json({
               message: "Company not found",
               success: false 
            });
        };

        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Internal Server error ${error.message || error}`,
            success: false
        });
    };
};

// TODO : Update Company Profile
export const updateCompany = async (req,res) => {
    try {
        const {name, description, website, location} = req.body;

        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(200).json({
                message: "Invalid Id",
                success: false
            });
        };

        const updateData = {};
        if(name !== undefined) updateData.name = name;
        if(description !== undefined) updateData.description = description;
        if(website !== undefined) updateData.website = website;
        if(location !== undefined) updateData.location = location;


        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new: true});

        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        };

        return res.status(200).json({
            message: "Company updated successfully",
            success: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `Internal Server error ${error.message || error}`,
            success: false
        });
    };
    
}
