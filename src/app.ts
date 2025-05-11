import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./app/config";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import { usersModel } from "./app/modules/users/users.model";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true               // jodi cookie/token pathaos
}));

// Set up static file serving for uploads
const uploadsPath = path.resolve("uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath)}

app.use("/uploads", express.static(uploadsPath));

//  test route:
app.get("/", (req, res) => {
  res.send("Hey my name is mohebulla!");
});


// routes:
app.use("/api/v1", router);

// not found middleware:
app.use(notFound);

// global error handler:
app.use(globalErrorHandler);


export const createSuperAdmin = async () => {
  try {
    const existingAdmin = await usersModel.findOne({ $or: [
      {
        email: process.env.SUPER_ADMIN_EMAIL,
      },
      {
        phone: process.env.SUPER_ADMIN_PHONE,
      }
    ] });

    if (existingAdmin) {
      console.log('✅ Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD!, 10);

    await usersModel.create({
      user: {
        name: "adminbd",
        email: "admin@demo.com",
        fullName: "Admin Bangladesh",
        nickName: "AdminBD",
        gender: "male",
        country: "Bangladesh",
        language: "Bengali",
        timeZone: "Asia/Dhaka",
        phone: "+8801700000000",
        password: "SecurePass123!",
        image: "https://example.com/images/admin.jpg",
        address: "Road 10, Gulshan 2, Dhaka 1212, Bangladesh",
        role: "admin",
      },
      restaurant: null,
      staff: null, 
      status: "active",

    });

    console.log('🚀 Super admin created successfully');
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
};
createSuperAdmin();

export default app;
