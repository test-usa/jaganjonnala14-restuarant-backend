export interface Ibrand {
    brandName: string;
    brandImage: string | null;
    brandDescription?: string;
    isActive?: boolean;
    isDelete?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}