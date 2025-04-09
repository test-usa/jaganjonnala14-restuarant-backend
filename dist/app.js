"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_model_1 = require("./app/modules/users/users.model");
// parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (origin) {
            callback(null, origin);
        }
        else {
            callback(null, "*");
        }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
const createAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if admin already exists
        const existingAdmin = yield users_model_1.usersModel.findOne({ email: "mohibullamiazi@gmail.com" });
        if (!existingAdmin) {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = yield bcryptjs_1.default.hash("password", saltRounds);
            // Create admin with hashed password
            yield users_model_1.usersModel.create({
                name: "Mohebulla Miazi",
                phone: "01956867166",
                address: "Dhaka, Bangladesh",
                email: "mohibullamiazi@gmail.com",
                password: hashedPassword, // Store the hashed password
                role: "admin",
            });
        }
        else {
            console.log("Admin already exists");
        }
    }
    catch (error) {
        console.error("Error creating admin:", error);
    }
});
createAdmin();
const uploadsPath = path_1.default.resolve("uploads");
if (!fs_1.default.existsSync(uploadsPath)) {
    fs_1.default.mkdirSync(uploadsPath);
}
app.use("/uploads", express_1.default.static(uploadsPath));
app.delete("http://localhost:5000/api/v1/unit/bulk-delete", (req, res) => {
    res.send("Hello World!");
});
// Not Found Middleware
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
