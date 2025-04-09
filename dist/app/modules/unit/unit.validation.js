"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitUpdateValidation = exports.unitValidation = void 0;
const zod_1 = require("zod");
exports.unitValidation = zod_1.z.object({
    // Example field (you can adjust based on your model)
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    // Add other fields based on your model's needs
});
exports.unitUpdateValidation = exports.unitValidation.partial(); // This allows partial updates to the unit schema, omitting fields not provided in the request body.
