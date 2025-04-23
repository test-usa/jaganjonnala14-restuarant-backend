import { Types } from "mongoose";

export interface Ivendors {
    user: Types.ObjectId; // Reference to Users
    shopName: string;
    logo?: string;
    shopAddress?: string;
    shopPhone?: string;
    shopEmail: string;
    description?: string;
    isVarified: boolean;
    isDelete?: boolean;
    isActive?: boolean;
    reating?: number;
}