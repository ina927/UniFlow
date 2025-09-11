import { prisma } from "@/shared";

export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({ where: { id } });
  return user;
};
