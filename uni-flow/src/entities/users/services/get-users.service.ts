import { User } from "@/shared/models";

export const getUsers = async () => {
  const users = await User.find();
  return users;
};
