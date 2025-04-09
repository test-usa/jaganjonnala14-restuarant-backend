"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResultImage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const config_1 = __importDefault(require("../config"));
const formatResultImage = (results, fieldName) => {
    const formatItem = (item, fieldName) => {
        const docData = item._doc || item;
        const fieldData = fieldName ? docData[fieldName] : undefined;
        if (Array.isArray(fieldData)) {
            return Object.assign(Object.assign({}, docData), { [fieldName || "attachment"]: fieldData.map((img) => `${config_1.default.base_url}/${img.replace(/\\/g, "/")}`) });
        }
        else if (typeof fieldData === "string") {
            return Object.assign(Object.assign({}, docData), { [fieldName || "attachment"]: `${config_1.default.base_url}/${fieldData.replace(/\\/g, "/")}` });
        }
        return docData;
    };
    if (Array.isArray(results)) {
        return results.map((item) => formatItem(item, fieldName));
    }
    else if (typeof results === "string") {
        return `${config_1.default.base_url}/${results.replace(/\\/g, "/")}`;
    }
    else {
        throw new Error("Unexpected results format");
    }
};
exports.formatResultImage = formatResultImage;
