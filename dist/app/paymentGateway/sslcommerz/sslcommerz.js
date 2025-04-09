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
/* eslint-disable @typescript-eslint/no-explicit-any */
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
class SSLCommerzService {
    constructor(store_id, store_passwd, is_live = false) {
        this.sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        this.store_id = store_id;
        this.store_passwd = store_passwd;
        this.is_live = is_live;
    }
    initPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiResponse = yield this.sslcz.init(data);
                return apiResponse.GatewayPageURL;
            }
            catch (error) {
                throw new Error('Error initializing payment: ' + error.message);
                throw error;
            }
        });
    }
    static createDefaultPaymentData(overrides = {}) {
        const defaultData = {
            total_amount: 100,
            currency: 'BDT',
            tran_id: 'REF' + Math.floor(Math.random() * 1000000000), // random transaction ID
            success_url: 'http://localhost:3030/success',
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        return Object.assign(Object.assign({}, defaultData), overrides);
    }
}
exports.default = SSLCommerzService;
