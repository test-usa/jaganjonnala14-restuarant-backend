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
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../product/product.model");
const config_1 = __importDefault(require("../../config"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const order_model_1 = require("./order.model");
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = require("../cart/cart.model");
const coupon_model_1 = require("../coupon/coupon.model");
const create = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderService.create(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Order Placed Successfully",
        data: result,
    });
}));
const sslcommerz = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const orderData = req.body;
    const { customer, items, total, delivery } = orderData;
    // Validate required fields
    if (!customer || !items || !total || !delivery) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Missing required fields in order data",
            data: null,
        });
    }
    // Generate unique transaction ID with more entropy
    const tran_id = `ORDER_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    try {
        // Find products with proper error handling
        const products = yield product_model_1.productModel
            .find({
            _id: { $in: items.map((item) => item.product) },
        })
            .populate("productCategory");
        if (products.length !== items.length) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: "Some products not found",
                data: null,
            });
        }
        // Prepare product information with fallbacks
        const productNames = products.map((product) => product.productName || "Unnamed Product");
        const productCategories = products.map((product) => { var _a; return ((_a = product.productCategory) === null || _a === void 0 ? void 0 : _a.name) || "General"; });
        // Configure SSLCommerz payload with all required fields
        const post_body = {
            total_amount: total,
            currency: "BDT",
            tran_id: tran_id,
            success_url: `${config_1.default.base_url}/api/v1/orders/payments/success/${tran_id}`,
            fail_url: `${config_1.default.base_url}/api/v1/orders/payments/fail/${tran_id}`,
            cancel_url: `${config_1.default.base_url}/api/v1/orders/payments/cancel/${tran_id}`,
            ipn_url: `${config_1.default.base_url}/api/v1/orders/payments/ipn`,
            // Customer information (all required by SSLCommerz)
            cus_name: customer.name || "Guest Customer",
            cus_email: customer.email || "no-email@example.com",
            cus_phone: customer.phone || "01700000000",
            cus_add1: customer.address || "Not Provided",
            // Shipping information
            shipping_method: delivery.location === "inside" ? "NO" : "YES",
            num_of_item: items.length,
            product_name: productNames.join(", "),
            product_category: productCategories.join(", "),
            product_profile: "general",
        };
        // Initialize SSLCommerz with sandbox credentials
        const sslcz = new sslcommerz_lts_1.default("miazi67e824ece0b11", "miazi67e824ece0b11@ssl", false // Sandbox mode
        );
        // Initiate the payment
        const apiResponse = yield sslcz.init(post_body);
        // Save the order to database with pending status
        const savedOrder = yield order_model_1.orderModel.create(Object.assign(Object.assign({}, orderData), { customerId: user.id, transactionId: tran_id }));
        if (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.GatewayPageURL) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                message: "Payment initiated successfully",
                data: {
                    payment_url: apiResponse.GatewayPageURL,
                    transaction_id: tran_id,
                    order: savedOrder,
                },
            });
        }
        else {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: "Failed to initiate payment",
                data: apiResponse,
            });
        }
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message || "Error while initiating payment",
            data: null,
        });
    }
}));
const paymentSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = req.params;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1. Find and update the order with transaction
        const order = yield order_model_1.orderModel
            .findOne({ transactionId: tran_id })
            .session(session);
        if (!order) {
            yield session.abortTransaction();
            session.endSession();
            return res.redirect(`${config_1.default.FRONTEND_URL}/payment/fail/${tran_id}`);
        }
        // 2. Update inventory (reduce stock)
        for (const item of order.items) {
            yield product_model_1.productModel.updateOne({ _id: item.product }, {
                $inc: {
                    productStock: -item.quantity,
                    salesCount: 1,
                },
            }, { session });
        }
        // 3. Clear user's cart
        if (order.customerId) {
            yield cart_model_1.cartModel.updateOne({ user: order.customerId }, { $set: { products: [], cartTotalCost: 0 } }, { session });
        }
        // 4. Update coupon usage if applied
        if (order.coupon) {
            yield coupon_model_1.couponModel.updateOne({ code: order.coupon.code }, {
                $inc: { usedCount: 1 },
                $addToSet: { usersUsed: order.customerId },
            }, { session });
        }
        // 5. Update order status
        order.status = "completed";
        order.paymentStatus = "paid";
        order.paymentDate = new Date();
        yield order.save({ session });
        // 6. Send confirmation email (simplified example)
        // try {
        //   await sendEmail({
        //     to: order.customer.email,
        //     subject: 'Order Confirmation #' + order.orderNumber,
        //     html: `<p>Your order #${order.orderNumber} has been confirmed. Total: ${order.total} BDT</p>`
        //   });
        // } catch (emailError) {
        //   console.error('Email sending failed:', emailError);
        // }
        // 7. Commit all changes
        yield session.commitTransaction();
        session.endSession();
        // 8. Redirect to success page
        return res.redirect(`${config_1.default.FRONTEND_URL}/payment/success/${tran_id}`);
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Payment processing error:", error);
        return res.redirect(`${config_1.default.FRONTEND_URL}/payment/fail/${tran_id}`);
    }
}));
const orderConfirm = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1. Find and update the order with transaction
        const order = yield order_model_1.orderModel.findOne({ _id: orderId }).session(session);
        if (!order) {
            yield session.abortTransaction();
            session.endSession();
            throw new Error(`Cannot find order ` + orderId);
        }
        // 2. Update inventory (reduce stock)
        for (const item of order.items) {
            yield product_model_1.productModel.updateOne({ _id: item.product }, {
                $inc: {
                    productStock: -item.quantity,
                    salesCount: 1,
                },
            }, { session });
        }
        // 3. Clear user's cart
        if (order.customerId) {
            yield cart_model_1.cartModel.updateOne({ user: order.customerId }, { $set: { products: [], cartTotalCost: 0 } }, { session });
        }
        // 4. Update coupon usage if applied
        if (order.coupon) {
            yield coupon_model_1.couponModel.updateOne({ code: order.coupon.code }, {
                $inc: { usedCount: 1 },
                $addToSet: { usersUsed: order.customerId },
            }, { session });
        }
        // Generate unique transaction ID with more entropy
        const tran_id = `ORDER_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
        // 5. Update order status
        order.status = "completed";
        order.transactionId = tran_id;
        order.paymentStatus = "paid";
        order.paymentDate = new Date();
        yield order.save({ session });
        // 6. Send confirmation email (simplified example)
        // try {
        //   await sendEmail({
        //     to: order.customer.email,
        //     subject: 'Order Confirmation #' + order.orderNumber,
        //     html: `<p>Your order #${order.orderNumber} has been confirmed. Total: ${order.total} BDT</p>`
        //   });
        // } catch (emailError) {
        //   console.error('Email sending failed:', emailError);
        // }
        // 7. Commit all changes
        yield session.commitTransaction();
        session.endSession();
        // 8. Redirect to success page
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Order completed",
            data: null,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Payment processing error:", error);
        throw new Error(("Payment processing error: " + error));
    }
}));
const cancelOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1. Find and update the order with transaction
        const order = yield order_model_1.orderModel.findOne({ _id: orderId }).session(session);
        if (!order) {
            yield session.abortTransaction();
            session.endSession();
            throw new Error(`Cannot find order ` + orderId);
        }
        // 5. Update order status
        order.status = "cancelled";
        yield order.save({ session });
        // 6. Send confirmation email (simplified example)
        // try {
        //   await sendEmail({
        //     to: order.customer.email,
        //     subject: 'Order Confirmation #' + order.orderNumber,
        //     html: `<p>Your order #${order.orderNumber} has been confirmed. Total: ${order.total} BDT</p>`
        //   });
        // } catch (emailError) {
        //   console.error('Email sending failed:', emailError);
        // }
        // 7. Commit all changes
        yield session.commitTransaction();
        session.endSession();
        // 8. Redirect to success page
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Order completed",
            data: null,
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Payment processing error:", error);
        throw new Error(("Payment processing error: " + error));
    }
}));
const paymentFail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = req.params;
    // Update order status in database
    yield order_model_1.orderModel.updateOne({ transactionId: tran_id }, // Query: যেই ট্রানজ্যাকশন আইডি আছে সেটি খুঁজবে
    {
        $set: {
            status: "failed",
            updatedAt: new Date(),
        },
    });
    return res.redirect(`${config_1.default.FRONTEND_URL}/payment/fail/${tran_id}`);
}));
const paymentCancel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = req.params;
    // Update order status in database
    yield order_model_1.orderModel.updateOne({ transactionId: tran_id }, // Query: যেই ট্রানজ্যাকশন আইডি আছে সেটি খুঁজবে
    {
        $set: {
            status: "cancelled",
            updatedAt: new Date(),
        },
    });
    return res.redirect(`${config_1.default.FRONTEND_URL}/payment/cancelled/${tran_id}`);
}));
const paymentIPN = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Instant Payment Notification - for server-to-server communication
    const { tran_id } = req.body;
    if (req.body.status === "VALID") {
        yield order_service_1.orderService.update({
            transactionId: tran_id,
            paymentStatus: "completed",
            paymentDetails: req.body,
        });
    }
    res.status(200).json({ status: "OK" });
}));
const getAll = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderService.getAll(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const getById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderService.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Fetched successfully",
        data: result,
    });
}));
const update = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderService.update(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Updated successfully",
        data: result,
    });
}));
const deleteEntity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield order_service_1.orderService.delete(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Deleted successfully",
        data: null,
    });
}));
const bulkDelete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body.ids; // Expecting an array of IDs to be passed for bulk delete
    if (!Array.isArray(ids) || ids.length === 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "Invalid IDs array",
            data: null,
        });
    }
    yield order_service_1.orderService.bulkDelete(ids);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bulk delete successful",
        data: null,
    });
}));
exports.orderController = {
    create,
    getAll,
    cancelOrder,
    getById,
    update,
    delete: deleteEntity,
    bulkDelete,
    sslcommerz,
    paymentSuccess,
    orderConfirm,
    paymentFail,
    paymentCancel,
    paymentIPN,
};
