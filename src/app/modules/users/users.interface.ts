export interface Iusers {
    name: string;
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
  }
  