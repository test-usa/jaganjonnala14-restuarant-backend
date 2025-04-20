import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"

// Routes
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import productRoutes from "./routes/product.routes"
import categoryRoutes from "./routes/category.routes"
import orderRoutes from "./routes/order.routes"
import rewardRoutes from "./routes/reward.routes"
import analyticsRoutes from "./routes/analytics.routes"
import settingsRoutes from "./routes/settings.routes"

// Middleware
import { errorHandler } from "./middleware/error.middleware"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tasty-bites"

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/rewards", rewardRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/settings", settingsRoutes)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build/index.html"))
  })
}

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

export default app
