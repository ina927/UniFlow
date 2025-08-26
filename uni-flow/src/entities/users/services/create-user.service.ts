import { User } from "@/shared/models";
import { CreateUserDto } from "../dto/create-user.dto";

export const createUser = async (user: CreateUserDto) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      const mongoError = error as { keyValue?: { email?: string } };
      const email = mongoError.keyValue?.email || 'unknown email';
      const errorMessage = `An account with this email already exists: ${email}`;
      const customError = new Error(errorMessage);
      customError.name = 'DuplicateEmailError';
      throw customError;
    }
    console.error("Error creating user:", error);
    throw error;
  }
};
