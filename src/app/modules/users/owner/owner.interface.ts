import { Types } from "mongoose";

export interface Iowner {
    user : Types.ObjectId;
    restaurant: Types.ObjectId;
    bussinessName: string;
    bussinessEmail: string;
    referralCode: string;
    taxInfo: {
        gstRate: string;
        cgstRate:string;
        sgstRate: string;
    }

}