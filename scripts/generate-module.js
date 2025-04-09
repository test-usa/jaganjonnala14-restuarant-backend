// /* eslint-disable @typescript-eslint/no-require-imports */
// /* eslint-disable no-undef */

// const path = require("path");
// const fs = require("fs");

// const moduleName = process.argv[2];
// if (!moduleName) {
//   console.error("❌ Please provide a module name.");
//   process.exit(1);
// }

// const modulePath = path.join(__dirname, "..", "src", "app", "modules", moduleName);

// // Module structure
// const files = [
//   `${moduleName}.routes.ts`,
//   `${moduleName}.interface.ts`,
//   `${moduleName}.validation.ts`,
//   `${moduleName}.model.ts`,
//   `${moduleName}.controller.ts`,
//   `${moduleName}.service.ts`,
//   `${moduleName}.constant.ts`
// ];

// // Create the module folder if not exists
// if (!fs.existsSync(modulePath)) {
//   fs.mkdirSync(modulePath, { recursive: true });
// }

// // Create each file with a default template
// files.forEach((file) => {
//   const filePath = path.join(modulePath, file);
//   if (!fs.existsSync(filePath)) {
//     fs.writeFileSync(filePath, `// ${file} - ${moduleName} module\n`, "utf8");
//     console.log(`✅ Created: ${filePath}`);
//   } else {
//     console.log(`⚠️ File already exists: ${filePath}`);
//   }
// });

// console.log(`🎉 ${moduleName} module generated successfully!`);
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("❌ Please provide a module name.");
  process.exit(1);
}

const modulePath = path.join(
  __dirname,
  "..",
  "src",
  "app",
  "modules",
  moduleName
);

// Module structure
const files = {
  [`${moduleName}.routes.ts`]: `import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { ${moduleName}Controller } from "./${moduleName}.controller";
import { ${moduleName}Validation } from "./${moduleName}.validation";

const router = express.Router();

router.post("/create", validateRequest(${moduleName}Validation), ${moduleName}Controller.create);
router.get("/", ${moduleName}Controller.getAll);
router.get("/:id", ${moduleName}Controller.getById);
router.put("/:id", validateRequest(${moduleName}UpdateValidation), ${moduleName}Controller.update);
router.delete("/:id", ${moduleName}Controller.delete);
router.delete("/bulk", ${moduleName}Controller.bulkDelete);

export const ${moduleName}Routes = router;`,

  [`${moduleName}.controller.ts`]: `import { Request, Response } from "express";
import { ${moduleName}Service } from "./${moduleName}.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.create(req.body);
  sendResponse(res, { statusCode: status.CREATED, success: true, message: "Created successfully", data: result });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.getAll(req.query);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
});

const getById = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.getById(req.params.id);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Fetched successfully", data: result });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const result = await ${moduleName}Service.update(req.body);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Updated successfully", data: result });
});

const deleteEntity = catchAsync(async (req: Request, res: Response) => {
  await ${moduleName}Service.delete(req.params.id);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Deleted successfully",data: null });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const ids: string[] = req.body.ids;  // Expecting an array of IDs to be passed for bulk delete
  if (!Array.isArray(ids) || ids.length === 0) {
    return sendResponse(res, { statusCode: status.BAD_REQUEST, success: false, message: "Invalid IDs array" ,data: null,});
  }
  await ${moduleName}Service.bulkDelete(ids);
  sendResponse(res, { statusCode: status.OK, success: true, message: "Bulk delete successful" ,data: null});
});

export const ${moduleName}Controller = { create, getAll, getById, update, delete: deleteEntity, bulkDelete };
`,

  [`${moduleName}.service.ts`]: `import { ${moduleName}Model } from "./${moduleName}.model";
  import { ${moduleName.toUpperCase()}_SEARCHABLE_FIELDS } from "./${moduleName}.constant";
import QueryBuilder from "../../builder/QueryBuilder";
import status from "http-status";
import AppError from "../../errors/AppError";


export const ${moduleName}Service = {
  async create(data: any) {
  try {
    return await ${moduleName}Model.create(data);
     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getAll(query: any) {
  try {


  const service_query = new QueryBuilder(${moduleName}Model.find(), query)
        .search(${moduleName.toUpperCase()}_SEARCHABLE_FIELDS)
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
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async getById(id: string) {
    try {
    return await ${moduleName}Model.findById(id);
     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async update(data: any) {
  try {



  const isDeleted = await ${moduleName}Model.findOne({ _id: data.id });
    if (isDeleted?.isDelete) {
      throw new AppError(status.NOT_FOUND, "${moduleName} is already deleted");
    }

    const result = await ${moduleName}Model.updateOne({ _id: data.id }, data, {
      new: true,
    });
    if (!result) {
      throw new Error("${moduleName} not found.");
    }
    return result;


     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async delete(id: string) {
    try {


 // Step 1: Check if the ${moduleName} exists in the database
    const isExist = await ${moduleName}Model.findOne({ _id: id });

    if (!isExist) {
      throw new AppError(status.NOT_FOUND, "${moduleName} not found");
    }

    // Step 4: Delete the home ${moduleName} from the database
    await ${moduleName}Model.updateOne({ _id: id }, { isDelete: true });
    return;

     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  },
  async bulkDelete(ids: string[]) {
  try {

 if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid IDs provided");
      }

      // Step 1: Check if the ${moduleName} exist in the database
      const existing${moduleName} = await ${moduleName}Model.find({ _id: { $in: ids } });

      if (existing${moduleName}.length === 0) {
        throw new AppError(
          status.NOT_FOUND,
          "No ${moduleName} found with the given IDs"
        );
      }

      // Step 2: Perform soft delete by updating isDelete field to true
      await ${moduleName}Model.updateMany({ _id: { $in: ids } }, { isDelete: true });

      return;




     } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(\`\${error.message}\`);
      } else {
        throw new Error("An unknown error occurred while fetching by ID.");
      }
    }
  }
};`,

  [`${moduleName}.model.ts`]: `import mongoose from "mongoose";

const ${moduleName}Schema = new mongoose.Schema({}, { timestamps: true });

export const ${moduleName}Model = mongoose.model("${moduleName}", ${moduleName}Schema);`,

  [`${moduleName}.interface.ts`]: `export interface I${moduleName} {}`,

  [`${moduleName}.validation.ts`]: `import { z } from 'zod';

export const ${moduleName}Validation = z.object({
  // Example field (you can adjust based on your model)
  name: z.string().min(1, { message: "Name is required" }),
  // Add other fields based on your model's needs
});


export const ${moduleName}UpdateValidation = ${moduleName}Validation.partial();
`,

  [`${moduleName}.constant.ts`]: `export const ${moduleName.toUpperCase()}_SEARCHABLE_FIELDS = [];`,
};

// Create the module folder if not exists
if (!fs.existsSync(modulePath)) {
  fs.mkdirSync(modulePath, { recursive: true });
}

// Create each file with a template
Object.entries(files).forEach(([file, content]) => {
  const filePath = path.join(modulePath, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️ File already exists: ${filePath}`);
  }
});

console.log(`🎉 ${moduleName} module generated successfully!`);
