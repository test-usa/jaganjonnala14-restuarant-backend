import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

import { usersModel } from "./app/modules/users/users.model";
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        callback(null, origin);
      } else {
        callback(null, "*");
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/api/v1", router);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await usersModel.findOne({ email: "mohibullamiazi@gmail.com" });
    
    if (!existingAdmin) {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash("password", saltRounds);
      
      // Create admin with hashed password
      await usersModel.create({
        name: "Mohebulla Miazi",
        phone: "01956867166",
        address: "Dhaka, Bangladesh",
        email: "mohibullamiazi@gmail.com",
        password: hashedPassword, // Store the hashed password
        role: "admin",
      });
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin();




const uploadsPath = path.resolve("uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath)}

app.use("/uploads", express.static(uploadsPath));

app.delete("http://localhost:5000/api/v1/unit/bulk-delete", (req: Request, res: Response) => {
  res.send("Hello World!");
});
// Not Found Middleware
app.use(notFound);

app.use(globalErrorHandler);

export default app;
