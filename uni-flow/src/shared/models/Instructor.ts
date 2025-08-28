import { Schema, model, models } from "mongoose";

const InstructorSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const Instructor = models.Instructor || model("Instructor", InstructorSchema);
