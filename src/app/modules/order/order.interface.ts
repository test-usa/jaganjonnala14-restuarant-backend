import { Types } from "mongoose";

export interface IOrder {
    customer: {
        name: string;
        email?: string;
        phone: string;
        address: string;
    };
    payment: {
        type: "manual" | "cashOnDelivery" | "SSLCommerz";
        method?: "bkash" | "nagad" | "upay" | "rocket" | null;
        transactionId?: string;
        status: "pending" | "initiated" | "paid" | "failed";
    };
    delivery: {
        location: "inside" | "outside";
        fee: number;
    };
    coupon?: {
        code?: string;
        discount?: number;
    };
    items: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    subtotal: number;
    transactionId: string;
    total: number;
    paymentDate: string;
    paymentStatus : "paid" | "unpaid" ;
    status: "pending" | "completed" | "cancelled";
    createdAt?: Date;
    updatedAt?: Date;
}
