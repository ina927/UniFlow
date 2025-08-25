import { Schema, model, models } from "mongoose";

const AssessmentSchema = new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  weight: { type: Number, required: true },
  dueDate: Date,
  maxScore: { type: Number, required: true },
  score: Number,
  gradedDate: Date,
  description: String,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const Assessment = models.Assessment || model("Assessment", AssessmentSchema);
