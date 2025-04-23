"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
let server;
async function startServer() {
    try {
        await mongoose_1.default.connect(config_1.default.DATABASE_URL);
        server = app_1.default.listen(config_1.default.BACKEND_PORT, () => {
            console.log(`Server is running on port ${config_1.default.BACKEND_PORT}`);
            console.log(`Database connected successfully`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
    }
}
startServer();
process.on("unhandledRejection", (error) => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, error);
    if (server) {
        server.close(() => {
            console.log(`😈 server is closed`);
            process.exit(1);
        });
    }
});
process.on("uncaughtException", (err) => {
    console.log(`😈 uncaughtException is detected , shutting down ...`, err);
    process.exit(1);
});
