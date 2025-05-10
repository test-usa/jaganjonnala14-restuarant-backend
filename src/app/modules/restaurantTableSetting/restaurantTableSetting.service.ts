import { restaurantTableSettingModel } from "./restaurantTableSetting.model";
      import { RESTAURANTTABLESETTING_SEARCHABLE_FIELDS } from "./restaurantTableSetting.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const restaurantTableSettingService = {
      async postRestaurantTableSettingIntoDB(data: any) {
      try {
        return await restaurantTableSettingModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllRestaurantTableSettingFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(restaurantTableSettingModel.find(), query)
            .search(RESTAURANTTABLESETTING_SEARCHABLE_FIELDS)
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
      async getSingleRestaurantTableSettingFromDB(id: string) {
        try {
        return await restaurantTableSettingModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateRestaurantTableSettingIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await restaurantTableSettingModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "restaurantTableSetting is already deleted");
        }
    
        const result = await restaurantTableSettingModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("restaurantTableSetting not found.");
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
      async deleteRestaurantTableSettingFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the restaurantTableSetting exists in the database
        const isExist = await restaurantTableSettingModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "restaurantTableSetting not found");
        }
    
        // Step 4: Delete the home restaurantTableSetting from the database
        await restaurantTableSettingModel.updateOne({ _id: id }, { isDelete: true });
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