import { restaurantTableModel } from "./restaurantTable.model";
      import { RESTAURANTTABLE_SEARCHABLE_FIELDS } from "./restaurantTable.constant";
    import QueryBuilder from "../../builder/QueryBuilder";
    import status from "http-status";
    import AppError from "../../errors/AppError";
    




    export const restaurantTableService = {
      async postRestaurantTableIntoDB(data: any) {
      try {
        return await restaurantTableModel.create(data);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllRestaurantTableFromDB(query: any) {
      try {
    
    
      const service_query = new QueryBuilder(restaurantTableModel.find(), query)
            .search(RESTAURANTTABLE_SEARCHABLE_FIELDS)
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
      async getSingleRestaurantTableFromDB(id: string) {
        try {
        return await restaurantTableModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async updateRestaurantTableIntoDB(data: any) {
      try {
    
    
    
      const isDeleted = await restaurantTableModel.findOne({ _id: data.id });
        if (isDeleted?.isDelete) {
          throw new AppError(status.NOT_FOUND, "restaurantTable is already deleted");
        }
    
        const result = await restaurantTableModel.updateOne({ _id: data.id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("restaurantTable not found.");
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
      async deleteRestaurantTableFromDB(id: string) {
        try {
    
    
     // Step 1: Check if the restaurantTable exists in the database
        const isExist = await restaurantTableModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "restaurantTable not found");
        }
    
        // Step 4: Delete the home restaurantTable from the database
        await restaurantTableModel.updateOne({ _id: id }, { isDelete: true });
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