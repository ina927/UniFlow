import { Schema, model, models } from "mongoose";
import { ToDoStatus } from "@/entities/enums";

const ToDoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
  assessmentId: { type: Schema.Types.ObjectId, ref: "Assessment" },
  title: { type: String, required: true },
  content: String,
  startDate: Date,
  endDate: Date,
  taskStatus: { 
    type: String, 
    enum: Object.values(ToDoStatus), 
    default: ToDoStatus.PENDING, 
    required: true 
  },
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const ToDo = models.ToDo || model("ToDo", ToDoSchema);