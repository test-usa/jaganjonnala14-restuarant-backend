"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableModel = void 0;
const mongoose_1 = require("mongoose");
const TableSchema = new mongoose_1.Schema({
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableName: { type: String, required: true },
    tableSetting: { type: String, required: true },
    seatingCapacity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});
exports.TableModel = (0, mongoose_1.model)("Table", TableSchema);
