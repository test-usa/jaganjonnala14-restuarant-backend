import { Types } from "mongoose";

export type Istaff = {
  user: Types.ObjectId;
  restautant: Types.ObjectId;
  workDay: string;
  workTime: string;
};
