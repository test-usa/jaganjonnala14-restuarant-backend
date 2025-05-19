"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const users_model_1 = require("../modules/users/user/users.model");
const owner_model_1 = require("../modules/users/owner/owner.model");
const mongoose_1 = __importDefault(require("mongoose"));
const owner_constant_1 = require("../modules/users/owner/owner.constant");
const config_1 = __importDefault(require("../config"));
dotenv_1.default.config();
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.default.GOOGLE_CLIENT_ID || "",
    clientSecret: config_1.default.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new Error("No email found in Google profile.");
        }
        let user = await users_model_1.userModel.findOne({ email }).session(session);
        // ❌ Case: email/password already exists
        if (user && !user.provider) {
            throw new Error("You already have an account with this email. Please login using your password.");
        }
        // ✅ Case: Already exists with Google login
        if (user && user.provider === "google") {
            return done(null, user);
        }
        // ✅ Case: First-time Google login — create user, restaurant, and owner
        if (!user) {
            // 1. Create user
            let user = await users_model_1.userModel.create([
                {
                    name: profile.displayName,
                    email: email,
                    image: profile.photos?.[0]?.value,
                    provider: "google",
                    providerId: profile.id,
                    role: "restaurant_owner", // set directly
                },
            ], { session });
            // 2. Create owner
            const owner = await owner_model_1.OwnerModel.create([
                {
                    user: user[0]._id,
                    businessName: `${profile.displayName}'s Business`,
                    businessEmail: email,
                    status: owner_constant_1.OWNER_STATUS.PENDING,
                },
            ], { session });
        }
        await session.commitTransaction();
        session.endSession();
        return done(null, user);
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        return done(error, null);
    }
}));
// Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID!,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
//       callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
//       profileFields: ["id", "emails", "name", "photos"],
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         console.log("profile", profile);
//         return;
//         const email =
//           profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
//         let user = await usersModel.findOne({
//           providerId: profile.id,
//           provider: "facebook",
//         });
//         if (!user) {
//           user = await usersModel.create({
//             name: `${profile.name?.givenName} ${profile.name?.familyName}`,
//             email,
//             image: profile.photos?.[0]?.value,
//             provider: "facebook",
//             providerId: profile.id,
//             status: "active",
//           });
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );
// ❗ Disable session behavior completely for JWT-based auth
passport_1.default.serializeUser(() => { });
passport_1.default.deserializeUser(() => { });
