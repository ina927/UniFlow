import { Schema, model, models } from "mongoose";

const TimerSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toDoId: { type: Schema.Types.ObjectId, ref: "ToDo" },
  startTime: { type: Date, default: Date.now, required: true },
  endTime: Date,
}, {
  id: true,
  timestamps: true,
  versionKey: "version",
});

export const TimerSession = models.TimerSession || model("TimerSession", TimerSessionSchema);
