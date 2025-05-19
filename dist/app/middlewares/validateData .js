"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const validateData = async (schema, data) => {
    return schema.parseAsync(data);
};
exports.validateData = validateData;
