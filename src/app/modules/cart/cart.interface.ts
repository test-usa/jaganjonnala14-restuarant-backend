import { ObjectId } from "mongoose";


// Cart Product Item interface
interface CartProductItem {
  product: ObjectId; // Referencing Product model ObjectId
  quantity: number;
  variant?: ObjectId; // Referencing AttributeOption model ObjectId
  price: number;
  totalPrice: number;
}

// Cart interface
export interface CartInterface {
  user: ObjectId; // Referencing User model ObjectId
  products: CartProductItem[];
  cartTotalCost?: number;
  isCheckout: boolean;
  isDelete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
