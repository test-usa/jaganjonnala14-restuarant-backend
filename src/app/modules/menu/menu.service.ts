
    import status from "http-status";
    import AppError from "../../errors/AppError";
    import { MenuModel } from "./menu.model";
    import { validateData } from "../../middlewares/validateData ";
    import { IMenu } from "./menu.interface";
    import { menuPostValidation } from "./menu.validation";
    import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { RestaurantModel } from "../restuarant/restuarant.model";
    

    export const menuService = {
      async postMenuIntoDB(data :  any , file: Express.Multer.File & { path?: string }) {
      try {

  
        const menudata = JSON.parse(data);
          
                 if (file) {
                   const imageName = `${Math.floor(100 + Math.random() * 900)}`;
                   const path = file.path;
                   const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
                     secure_url: string;
                   };
             
                   menudata.image = secure_url as string;
                 } else {
                  menudata.image = 'no image';
                 }

      const validatedData =  await validateData<IMenu>(menuPostValidation,menudata );


      const restaurant = await  RestaurantModel.findOne({_id: validatedData.restaurant});
 
      if(!restaurant){
        throw new AppError(400,"restaurant doesn't found");
      }
               
        return await MenuModel.create(validatedData);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getAllMenuFromDB(query: any) {
      try {
      const result  = await  MenuModel.find({})
          return {
            result
          };
    
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
      async getSingleMenuFromDB(id: string) {
        try {
        return await MenuModel.findById(id);
         } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`${error.message}`);
          } else {
            throw new Error("An unknown error occurred while fetching by ID.");
          }
        }
      },
  async updateMenuIntoDB(data:IMenu,id: string) {
      try {

      const isDeleted = await MenuModel.findOne({ _id:id});
        if (isDeleted?.isDeleted) {
          throw new AppError(status.NOT_FOUND, "menu is already deleted");
        }
    
        const result = await MenuModel.updateOne({ _id:id }, data, {
          new: true,
        });
        if (!result) {
          throw new Error("menu not found.");
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
      async deleteMenuFromDB(id: string) {
        try {
    
 
        const isExist = await MenuModel.findOne({ _id: id });
    
        if (!isExist) {
          throw new AppError(status.NOT_FOUND, "menu not found");
        }
    
        await MenuModel.findByIdAndDelete({ _id: id });
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