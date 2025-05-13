import mongoose from "mongoose";
import { userModel } from "../users/user/users.model";
import { IRestaurantValidationRequest } from "./auth.validation";
import { ROLE, USER_STATUS } from "../users/user/users.constant";
import bcrypt from "bcryptjs";
import { RestaurantModel } from "../restuarant/restuarant.model";
import { OwnerModel } from "../users/owner/owner.model";
import { generateOtp } from "../../utils/generateOtp";
import { sendOtpToEmail } from "../../utils/sendOtpToEmail";
import { sendOtpToPhone } from "../../utils/sendOtpToPhone";
import { RESTAURANT_STATUS } from "../restuarant/restuarant.constant";

export const authService = {
  async restuarantRegisterRequestIntoDB(data: IRestaurantValidationRequest) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // 1. create user
      const existingUser: any = await userModel
        .findOne({ email: data.businessEmail })
        .session(session);

      if (existingUser) {
        throw new Error("Restaurant owner already exists.");
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const otp = generateOtp(4);

      const newUser = await userModel.create(
        [
          {
            name: "New User",
            email: data.businessEmail,
            phone: data.phone,
            otp,
            otpExpiresAt: new Date(Date.now() + 5 * 60000),
            role: ROLE.RESTAURANT_OWNER,
            password: hashedPassword,
          },
        ],
        { session }
      );

      // 2. create restaurant
      const newRestaurant = await RestaurantModel.create(
        [
          {
            restaurantName: data.restaurantName,
            restaurantAddress: data.restaurantAddress,
            phone: data.phone,
            status: RESTAURANT_STATUS.UNVERIFIED,
          },
        ],
        { session }
      );

      // 3. create owner
      const newOwner = await OwnerModel.create(
        [
          {
            user: newUser[0]._id,
            restaurant: newRestaurant[0]._id,
            businessName: data.businessName,
            businessEmail: data.businessEmail,
            referralCode: data.referralCode,
          },
        ],
        { session }
      );

      // 4. update restaurant with owner ID
      await RestaurantModel.updateOne(
        { _id: newRestaurant[0]._id },
        { $set: { owner: newOwner[0]._id } },
        { session }
      );

      // send OTP via SMS/email
      await sendOtpToEmail(data.businessEmail, otp);
      // await sendOtpToPhone(data.phone, otp);

      // ✅ COMMIT the transaction
      await session.commitTransaction();
      session.endSession();

      return {
        userId: newUser[0]._id,
        restaurantId: newRestaurant[0]._id,
        ownerId: newOwner[0]._id,
      };
    } catch (error: unknown) {
      await session.abortTransaction();
      session.endSession();

      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error("An unknown error occurred during registration.");
      }
    }
  },
};
