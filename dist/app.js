"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./app/routes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require("../src/app/utils/passport.ts");
const users_model_1 = require("./app/modules/users/user/users.model");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // jodi cookie/token pathaos
}));
// Set up static file serving for uploads
const uploadsPath = path_1.default.resolve("uploads");
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath);
}
app.use("/uploads", express_1.default.static(uploadsPath));
//  test route:
app.get("/", (req, res) => {
    res.send("Hey my name is mohebulla!");
});
// routes:
app.use("/api/v1", routes_1.default);
// not found middleware:
app.use(notFound_1.default);
// global error handler:
app.use(globalErrorHandler_1.default);
const createAdmin = async () => {
    try {
        const existingAdmin = await users_model_1.userModel.findOne({
            role: "admin"
        });
        if (existingAdmin) {
            console.log("✅ Super admin already exists");
            return;
        }
        const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_FULLNAME, SUPER_ADMIN_NICKNAME, SUPER_ADMIN_GENDER, SUPER_ADMIN_COUNTRY, SUPER_ADMIN_LANGUAGE, SUPER_ADMIN_TIMEZONE, SUPER_ADMIN_PHONE, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_ADDRESS, } = process.env;
        if (!SUPER_ADMIN_NAME ||
            !SUPER_ADMIN_EMAIL ||
            !SUPER_ADMIN_FULLNAME ||
            !SUPER_ADMIN_NICKNAME ||
            !SUPER_ADMIN_GENDER ||
            !SUPER_ADMIN_COUNTRY ||
            !SUPER_ADMIN_LANGUAGE ||
            !SUPER_ADMIN_TIMEZONE ||
            !SUPER_ADMIN_PHONE ||
            !SUPER_ADMIN_PASSWORD ||
            !SUPER_ADMIN_ADDRESS) {
            throw new Error("🚫 Missing SUPER_ADMIN environment variables.");
        }
        const hashedPassword = await bcryptjs_1.default.hash(SUPER_ADMIN_PASSWORD, 10);
        await users_model_1.userModel.create({
            name: SUPER_ADMIN_NAME,
            email: SUPER_ADMIN_EMAIL,
            phone: SUPER_ADMIN_PHONE,
            password: hashedPassword,
            image: null,
            role: "admin",
        });
        console.log("🚀 Super admin created successfully");
    }
    catch (error) {
        console.error("❌ Error creating super admin:", error);
    }
};
exports.createAdmin = createAdmin;
(0, exports.createAdmin)();
exports.default = app;
