import { userModel } from "./users.model";
import { IUser } from "./users.interface";
import AppError from "../../../errors/AppError";


const createUser = async (data: IUser) => {
  const result = await userModel.create(data);
  return result;
};

const getAllUsers = async () => {
  return userModel.find({ isDeleted: false });
};

const getSingleUser = async (id: string) => {
  const result = await userModel.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const result = await userModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await userModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "User not found");
  }
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
