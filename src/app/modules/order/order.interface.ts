import mongoose, { Types } from "mongoose";

export interface IOrder {
  Restaurant: Types.ObjectId;
  table: Types.ObjectId;
  menus: [Types.ObjectId];

  CustomerName: string;
  CustomerPhone: string;
  orderType: "dine in" | "takeaway";
  status: "pending" | "inProgress" | "delivered" | "cancel";
  specialRequest: string;
  total: number;
}
