import { Role, UserStatus } from "../enums";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  dob: Date;
  hash: string;
}
