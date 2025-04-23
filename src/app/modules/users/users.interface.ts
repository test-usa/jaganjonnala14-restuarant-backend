export interface Iusers {
    _id?: string;
    name: string;
    image?: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role: 'admin' | 'vendor' | 'customer' | 'manager';
    isActive?: boolean;
    isDelete?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}