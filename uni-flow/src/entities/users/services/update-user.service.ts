import { UpdateUserDto } from "@/entities/users/dto";
import { User } from "@/shared/models";

export const updateUser = async (id: string, body: UpdateUserDto) => {
  const user = await User.findByIdAndUpdate(id, body);
  return user;
};
