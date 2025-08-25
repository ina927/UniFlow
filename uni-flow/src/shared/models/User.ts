import { Schema, model, models } from "mongoose";
import { Role, UserStatus } from "@/entities";

const UserSchema = new Schema({ 
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  dob: { type: Date },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const User = models.User || model("User", UserSchema);
