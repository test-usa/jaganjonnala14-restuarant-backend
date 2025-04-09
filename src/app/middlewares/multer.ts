/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import fs from "fs";
import path from "path";


interface getMulterProps {
  upload_file_destination_path: any;
  regex: any;
  images: any;
}

export const getMuler = ({
  upload_file_destination_path,
  regex,
  images,
}: getMulterProps) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(upload_file_destination_path)) {
        fs.mkdirSync(upload_file_destination_path, { recursive: true });
      }
      cb(null, upload_file_destination_path);
    },
    filename: function (req, file, cb) {
      const extention = path.extname(file?.originalname);
      const file_name =
        file?.originalname
          .replace(extention, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      cb(null, file_name + extention);
    },
  });

  // File filter function
  const fileFilter = (
    regex: any,
    images: any,
    file: Express.Multer.File,
    cb: any
  ) => {
    const extName = regex.test(path.extname(file?.originalname).toLowerCase());
    const mimeType = regex.test(file?.mimetype);

    if (mimeType && extName) {
      return cb(null, true); // Accept the file
    } else {
      return cb(
        new Error(`You can only upload images of type: ${images}.`),
        false
      ); // Reject the file
    }
  };

  return multer({
    storage: storage,
    limits: {
      fileSize: 10000000 * 3,
    },
    fileFilter: (req, file, cb) => fileFilter(regex, images, file, cb),
  });
};

