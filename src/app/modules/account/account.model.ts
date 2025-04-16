import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountName: {
        type: String
    },
    accounttype: {
        type: String
    },
    accountDetails: {
        type: String
    },
    amount: {
        type: String
    }
}, { timestamps: true });

export const accountModel = mongoose.model("account", accountSchema);