import { User } from "@/shared/models";
import { connectDB } from "@/shared/lib/mongoose";

export const getUsers = async () => {
  await connectDB();
  const users = await User.find();
  return users;
};
