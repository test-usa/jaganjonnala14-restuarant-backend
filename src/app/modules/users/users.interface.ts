export interface Iusers {
  name: string;
  _id?: string;
  email?: string;
  phone: string;
  password: string;
  image?: string;
  address?: string;
  role?: "admin" | "employee" | "customer";
  rewardPoints?: number;
  isActive?: boolean;
  lastLogin?: Date;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword?: (password: string) => Promise<boolean>;
  generateAuthToken?: () => string;
}
