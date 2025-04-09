"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersUpdateValidation = exports.usersValidation = void 0;
const zod_1 = require("zod");
exports.usersValidation = zod_1.z.object({
    // Example field (you can adjust based on your model)
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    // Add other fields based on your model's needs
});
exports.usersUpdateValidation = exports.usersValidation.partial();
