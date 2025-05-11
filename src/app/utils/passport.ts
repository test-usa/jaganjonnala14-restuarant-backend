import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import { usersModel } from "../modules/users/users.model";

dotenv.config();

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user: any = await usersModel.findOne({
          "user.email": email,
        });

        if (!user && email) {
          user = await usersModel.create({
            "user.fullName": profile.displayName,
            "user.email": email,
            "user.image": profile.photos?.[0]?.value,
            "user.provider": profile.provider,
            "user.providerId": profile.id,
            "user.role": "customer",
            status: "active",
          });
        }

        return done(null, user);
      } catch (error: any) {
        return done(error, null!);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
      profileFields: ["id", "emails", "name", "photos"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {

console.log("profile", profile);
return;

        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;
        let user = await usersModel.findOne({
          providerId: profile.id,
          provider: "facebook",
        });

        if (!user) {
          user = await usersModel.create({
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            email,
            image: profile.photos?.[0]?.value,
            provider: "facebook",
            providerId: profile.id,
            status: "active",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ❗ Disable session behavior completely for JWT-based auth
passport.serializeUser(() => {});
passport.deserializeUser(() => {});
