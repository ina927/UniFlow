import { UpdateUserDto } from "@/entities/users/dto";
import { prisma } from "@/shared";

export const updateUser = async (id: string, body: UpdateUserDto) => {
  const user = await prisma.user.update({ where: { id }, data: body });
  return user;
};
