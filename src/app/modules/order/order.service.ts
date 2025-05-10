import { orderModel } from "./order.model";
      import { ORDER_SEARCHABLE_FIELDS } from "./order.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const orderService = {
      async postOrderIntoDB(data: any) {
      try {
        return await orderModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllOrderFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(orderModel.find(), query)
            .search(ORDER_SEARCHABLE_FIELDS)
            .filter()
            .sort()
            .paginate()
            .fields();
      
          const result = await service_query.modelQuery;
          const meta = await service_query.countTotal();
          return {
            result,
            meta,
          };
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getSingleOrderFromDB(id: string) {
        try {
        return await orderModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateOrderIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await orderModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "order is already deleted");
        }
    
        const result = await orderModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("order not found.");
        }
        return result;
    
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async deleteOrderFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the order exists in the database
        const isExist = await orderModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "order not found");
        }
    
        // Step 4: Delete the home order from the database
        await orderModel.updateOne({ _id: id }, { isDelete: true });
        return;
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
    };