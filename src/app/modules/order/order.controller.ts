/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { orderService } from "./order.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { productModel } from "../product/product.model";
import config from "../../config";
import SSLCommerzPayment from "sslcommerz-lts";
import { orderModel } from "./order.model";
import mongoose from "mongoose";
import { cartModel } from "../cart/cart.model";
import { couponModel } from "../coupon/coupon.model";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.create(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Order Placed Successfully",
    data: result,
  });
});

const sslcommerz = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const orderData = req.body;
  const { customer, items, total, delivery } = orderData;

  // Validate required fields
  if (!customer || !items || !total || !delivery) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Missing required fields in order data",
      data: null,
    });
  }

  // Generate unique transaction ID with more entropy
  const tran_id = `ORDER_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;

  try {
    // Find products with proper error handling
    const products = await productModel
      .find({
        _id: { $in: items.map((item: any) => item.product) },
      })
      .populate("productCategory");

    if (products.length !== items.length) {
      return sendResponse(res, {
        statusCode: status.BAD_REQUEST,
        success: false,
        message: "Some products not found",
        data: null,
      });
    }

    // Prepare product information with fallbacks
    const productNames = products.map(
      (product) => product.productName || "Unnamed Product"
    );
    const productCategories = products.map(
      (product) => (product as any).productCategory?.name || "General"
    );

    // Configure SSLCommerz payload with all required fields
    const post_body: any = {
      total_amount: total,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${config.base_url}/api/v1/orders/payments/success/${tran_id}`,
      fail_url: `${config.base_url}/api/v1/orders/payments/fail/${tran_id}`,
      cancel_url: `${config.base_url}/api/v1/orders/payments/cancel/${tran_id}`,
      ipn_url: `${config.base_url}/api/v1/orders/payments/ipn`,

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
    const sslcz = new SSLCommerzPayment(
      "miazi67e824ece0b11",
      "miazi67e824ece0b11@ssl",
      false // Sandbox mode
    );

    // Initiate the payment
    const apiResponse = await sslcz.init(post_body);

    // Save the order to database with pending status
    const savedOrder = await orderModel.create({
      ...orderData,
      customerId: user.id,
      transactionId: tran_id,
    });

    if (apiResponse?.GatewayPageURL) {
      return sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Payment initiated successfully",
        data: {
          payment_url: apiResponse.GatewayPageURL,
          transaction_id: tran_id,
          order: savedOrder,
        },
      });
    } else {
      return sendResponse(res, {
        statusCode: status.BAD_REQUEST,
        success: false,
        message: "Failed to initiate payment",
        data: apiResponse,
      });
    }
  } catch (error: unknown) {
    return sendResponse(res, {
      statusCode: status.INTERNAL_SERVER_ERROR,
      success: false,
      message: (error as any).message || "Error while initiating payment",
      data: null,
    });
  }
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find and update the order with transaction
    const order = await orderModel
      .findOne({ transactionId: tran_id })
      .session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.redirect(`${config.FRONTEND_URL}/payment/fail/${tran_id}`);
    }

    // 2. Update inventory (reduce stock)
    for (const item of order.items) {
      await productModel.updateOne(
        { _id: item.product },
        {
          $inc: {
            productStock: -item.quantity,
            salesCount: 1,
          },
        },
        { session }
      );
    }

    // 3. Clear user's cart
    if (order.customerId) {
      await cartModel.updateOne(
        { user: order.customerId },
        { $set: { products: [], cartTotalCost: 0 } },
        { session }
      );
    }

    // 4. Update coupon usage if applied
    if (order.coupon) {
      await couponModel.updateOne(
        { code: order.coupon.code },
        {
          $inc: { usedCount: 1 },
          $addToSet: { usersUsed: order.customerId },
        },
        { session }
      );
    }

    // 5. Update order status
    order.status = "completed";
    order.paymentStatus = "paid";
    order.paymentDate = new Date();
    await order.save({ session });

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
    await session.commitTransaction();
    session.endSession();

    // 8. Redirect to success page
    return res.redirect(`${config.FRONTEND_URL}/payment/success/${tran_id}`);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment processing error:", error);
    return res.redirect(`${config.FRONTEND_URL}/payment/fail/${tran_id}`);
  }
});
const orderConfirm = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find and update the order with transaction
    const order = await orderModel.findOne({ _id: orderId }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Cannot find order ` + orderId);
    }

    // 2. Update inventory (reduce stock)
    for (const item of order.items) {
      await productModel.updateOne(
        { _id: item.product },
        {
          $inc: {
            productStock: -item.quantity,
            salesCount: 1,
          },
        },
        { session }
      );
    }

    // 3. Clear user's cart
    if (order.customerId) {
      await cartModel.updateOne(
        { user: order.customerId },
        { $set: { products: [], cartTotalCost: 0 } },
        { session }
      );
    }

    // 4. Update coupon usage if applied
    if (order.coupon) {
      await couponModel.updateOne(
        { code: order.coupon.code },
        {
          $inc: { usedCount: 1 },
          $addToSet: { usersUsed: order.customerId },
        },
        { session }
      );
    }
    // Generate unique transaction ID with more entropy
    const tran_id = `ORDER_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;

    // 5. Update order status
    order.status = "completed";
    order.transactionId = tran_id;
    order.paymentStatus = "paid";
    order.paymentDate = new Date();
    await order.save({ session });

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
    await session.commitTransaction();
    session.endSession();

    // 8. Redirect to success page
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order completed",
      data: null,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment processing error:", error);
    throw new Error(("Payment processing error: " + error) as any);
  }
});
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find and update the order with transaction
    const order = await orderModel.findOne({ _id: orderId }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Cannot find order ` + orderId);
    }

    // 5. Update order status
    order.status = "cancelled";
    await order.save({ session });

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
    await session.commitTransaction();
    session.endSession();

    // 8. Redirect to success page
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Order completed",
      data: null,
    });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment processing error:", error);
    throw new Error(("Payment processing error: " + error) as any);
  }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;

  // Update order status in database
  await orderModel.updateOne(
    { transactionId: tran_id }, // Query: যেই ট্রানজ্যাকশন আইডি আছে সেটি খুঁজবে
    {
      $set: {
        status: "failed",
        updatedAt: new Date(),
      },
    }
  );

  return res.redirect(`${config.FRONTEND_URL}/payment/fail/${tran_id}`);
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { tran_id } = req.params;

  // Update order status in database
  await orderModel.updateOne(
    { transactionId: tran_id }, // Query: যেই ট্রানজ্যাকশন আইডি আছে সেটি খুঁজবে
    {
      $set: {
        status: "cancelled",
        updatedAt: new Date(),
      },
    }
  );

  return res.redirect(`${config.FRONTEND_URL}/payment/cancelled/${tran_id}`);
});

const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  // Instant Payment Notification - for server-to-server communication
  const { tran_id } = req.body;

  if (req.body.status === "VALID") {
    await orderService.update({
      transactionId: tran_id,
      paymentStatus: "completed",
      paymentDetails: req.body,
    });
  }

  res.status(200).json({ status: "OK" });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getAll(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Fetched successfully",
    data: result,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.update(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  await orderService.delete(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Deleted successfully",
    data: null,
  });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const ids: string[] = req.body.ids; // Expecting an array of IDs to be passed for bulk delete
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Invalid IDs array",
      data: null,
    });
  }
  await orderService.bulkDelete(ids);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Bulk delete successful",
    data: null,
  });
});

export const orderController = {
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
