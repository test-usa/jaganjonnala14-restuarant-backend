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

export type IUser = {
  name: string;
  providerId?: string;
  provider?: string;
  email: string;
  phone: string;
  role: IUserRole;
  status: "active" | "inactive" | "pending";
  image: string;
  password: string;
  isDeleted: boolean;
};
