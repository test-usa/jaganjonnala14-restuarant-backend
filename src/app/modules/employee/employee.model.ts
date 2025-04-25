import mongoose from "mongoose";
    
    const employeeSchema = new mongoose.Schema({
    
     isDelete: {
            type: Boolean,
            default: false,
        }}, { timestamps: true });
    
    export const employeeModel = mongoose.model("employee", employeeSchema);