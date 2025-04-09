
// Brand.interface.ts - Brand module
export interface IBrand {
    name: string;
    isFeatured:string;
    image: string;
    status: "active" | "Inactive";
    isDelete: boolean;
  }
  