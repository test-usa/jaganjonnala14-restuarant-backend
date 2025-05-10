import { restaurantZoneTypeModel } from "./restaurantZoneType.model";
      import { RESTAURANTZONETYPE_SEARCHABLE_FIELDS } from "./restaurantZoneType.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const restaurantZoneTypeService = {
      async postRestaurantZoneTypeIntoDB(data: any) {
      try {
        return await restaurantZoneTypeModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllRestaurantZoneTypeFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(restaurantZoneTypeModel.find(), query)
            .search(RESTAURANTZONETYPE_SEARCHABLE_FIELDS)
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
      async getSingleRestaurantZoneTypeFromDB(id: string) {
        try {
        return await restaurantZoneTypeModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateRestaurantZoneTypeIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await restaurantZoneTypeModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "restaurantZoneType is already deleted");
        }
    
        const result = await restaurantZoneTypeModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("restaurantZoneType not found.");
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
      async deleteRestaurantZoneTypeFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the restaurantZoneType exists in the database
        const isExist = await restaurantZoneTypeModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "restaurantZoneType not found");
        }
    
        // Step 4: Delete the home restaurantZoneType from the database
        await restaurantZoneTypeModel.updateOne({ _id: id }, { isDelete: true });
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