import { Role, UserStatus } from "../enums";

export interface UpdateUserDto {
  name?: string;
  role?: Role;
  email?: string;
  hash?: string;
  dob?: Date;
  status?: UserStatus;
}
