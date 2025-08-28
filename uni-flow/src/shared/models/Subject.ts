import { Schema, model, models } from "mongoose";

const SubjectSchema = new Schema({
  termId: { type: Schema.Types.ObjectId, ref: "Term", required: true },
  title: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true },
  coordinator: { type: Schema.Types.ObjectId, ref: "Instructor" },
  labTutor: { type: Schema.Types.ObjectId, ref: "Instructor" },
  goalGrade: Number,
  actualGrade: Number,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const Subject = models.Subject || model("Subject", SubjectSchema);
