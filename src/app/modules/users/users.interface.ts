export type IUserRole =
  | "admin"
  | "restaurant_owner"
  | "staff"
  | "customer"
  | "manager"
  | "dine in"
  | "waiter"
  | "chief"
  | "cashier"
  | "maintenance";

export interface IRestaurant {
  name: string;
  businessName: string;
  businessEmail: string;
  phone: string;
  gstRate: string;
  cgstRate: string;
  sgstRate: string;
  address: string;
  logo: string;
  tagline: string;
  coverPhoto: string[];
  description: string;
  referralCode: string;
}

export interface Iusers {
  _id?: string;
  user: {
    name: string;
    providerId: string | null;   // google or facebook id
    provider: string | null;   // "google" | "facebook"
    email?: string;
    fullName: string;
    nickName: string;
    gender: "male" | "female";
    country: string;
    language: string;
    timeZone: string;
    phone: string;
    password: string;
    image?: string;
    address?: string;
    role?: IUserRole;
  };
  restaurant: IRestaurant;
  staff: {
    workDays: string;
    workTime: string;
  } | null;
  status: "active" | "inactive" | "pending";

  lastLogin?: Date;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword?: (password: string) => Promise<boolean>;
  generateAuthToken?: () => string;
}
