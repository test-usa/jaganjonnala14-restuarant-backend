/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "../config";

export const formatResultImage = <T extends { [key: string]: any }>(
  results: T[] | string,
  fieldName?: string
): T[] | string => {



  const formatItem = (item: T, fieldName?: keyof T): T => {
    const docData = (item as any)._doc || item;
    const fieldData = fieldName ? docData[fieldName] : undefined;

    if (Array.isArray(fieldData)) {
      return {
        ...docData,
        [fieldName || "attachment"]: fieldData.map((img: string) =>
          `${config.base_url}/${img.replace(/\\/g, "/")}`
        ),
      } as T;
    } else if (typeof fieldData === "string") {
      return {
        ...docData,
        [fieldName || "attachment"]: `${config.base_url}/${fieldData.replace(/\\/g, "/")}`,
      } as T;
    }

    return docData as T;
  };


  if (Array.isArray(results)) {
    return results.map((item) => formatItem(item, fieldName));
  } else if (typeof results === "string") {
    return `${config.base_url}/${results.replace(/\\/g, "/")}`;
  } else {
    throw new Error("Unexpected results format");
  }
};
