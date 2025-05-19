"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModel = void 0;
const mongoose_1 = require("mongoose");
const StaffSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    workDay: { type: String, required: true },
    workTime: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: "active"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});
exports.StaffModel = (0, mongoose_1.model)("Staff", StaffSchema);
