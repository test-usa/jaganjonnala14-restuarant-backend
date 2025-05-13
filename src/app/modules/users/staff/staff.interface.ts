import { Types } from "mongoose";

export type IStaff = {
  user: Types.ObjectId;
  restaurant: Types.ObjectId;
  workDay: string;
  workTime: string;
  isDeleted: boolean;
};
