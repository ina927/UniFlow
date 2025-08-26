import { User } from "@/shared/models";

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  return user;
};
