import { Role, UserStatus } from "../enums";

export interface CreateUserDto {
  name: string;
  role: Role;
  email: string;
  hash: string;
  dob: Date;
  status: UserStatus;
}
