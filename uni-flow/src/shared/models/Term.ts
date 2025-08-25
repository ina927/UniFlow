import { Schema, model, models } from "mongoose";

const TermSchema = new Schema({
  academicCourseId: { type: Schema.Types.ObjectId, ref: "AcademicCourse", required: true },
  title: String,
  currentAcademicYear: Number,
  startDate: Date,
  endDate: Date,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const Term = models.Term || model("Term", TermSchema);
