/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkIfDocumentExists = async(
  model: any,
  field: string,
  value: any
): Promise<boolean> => {
  try {
    const query  = { [field]: value } as any;
    const document = await model.findOne(query);

    // If document exists, return true, otherwise false
    return document !== null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
