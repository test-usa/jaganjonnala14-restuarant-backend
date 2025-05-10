import { restaurantLayoutModel } from "./restaurantLayout.model";
      import { RESTAURANTLAYOUT_SEARCHABLE_FIELDS } from "./restaurantLayout.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const restaurantLayoutService = {
      async postRestaurantLayoutIntoDB(data: any) {
      try {
        return await restaurantLayoutModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllRestaurantLayoutFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(restaurantLayoutModel.find(), query)
            .search(RESTAURANTLAYOUT_SEARCHABLE_FIELDS)
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
      async getSingleRestaurantLayoutFromDB(id: string) {
        try {
        return await restaurantLayoutModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateRestaurantLayoutIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await restaurantLayoutModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "restaurantLayout is already deleted");
        }
    
        const result = await restaurantLayoutModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("restaurantLayout not found.");
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
      async deleteRestaurantLayoutFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the restaurantLayout exists in the database
        const isExist = await restaurantLayoutModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "restaurantLayout not found");
        }
    
        // Step 4: Delete the home restaurantLayout from the database
        await restaurantLayoutModel.updateOne({ _id: id }, { isDelete: true });
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