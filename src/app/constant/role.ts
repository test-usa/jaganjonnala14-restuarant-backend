export const ROLE = {
    ADMIN: "admin",
    MANAGER: "manager",
    VENDOR: "vendor",
    CUSTOMER: "customer",
} as const;
export type Role = typeof ROLE[keyof typeof ROLE];
