import { User } from "@/shared/models";

export const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};
