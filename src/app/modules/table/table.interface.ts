import { Types } from "mongoose";

export interface ITable {
    restaurant: Types.ObjectId;
    TableName: string;
    TableSetting: string;
    seatingCapacity: Number;  

}