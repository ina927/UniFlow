import { Schema, model, models } from "mongoose";

const AcademicCourseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  degree: { type: String, required: true },
  major: { type: String, required: true },
  totalAcademicYear: Number,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const AcademicCourse = models.AcademicCourse || model("AcademicCourse", AcademicCourseSchema);
