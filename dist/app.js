"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./app/config"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const whiteList = [" http://localhost:3000", "https://example.com"]; // Add your allowed origins here
const corsOptions = {
    origin: config_1.default.ENVIRONMENT === "production"
        ? function (origin, callback) {
            if (whiteList.indexOf(origin) !== -1) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        }
        : "*",
};
app.use((0, cors_1.default)(corsOptions));
//  test route:
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// not found middleware:
app.use(notFound_1.default);
// global error handler:
app.use(globalErrorHandler_1.default);
exports.default = app;
