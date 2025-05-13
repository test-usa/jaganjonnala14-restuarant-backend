import { Types } from "mongoose";

export interface IRestaurant {
  owner: Types.ObjectId;
  restaurantName: string;
  restaurantAddress: string;
  phone: string;

  logo?: string; // Optional (nullable)
  tagline: string;
  coverPhoto: string;
  images: string[];
  description: string;
  isDeleted?: boolean;
}
