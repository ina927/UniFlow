import { ToDoStatus } from '@/entities/todos/enums';
import { Schema, model, models } from 'mongoose';

const ToDoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    title: { type: String, required: true },
    content: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: Object.values(ToDoStatus),
      default: ToDoStatus.PENDING,
      required: true,
    },
  },
  {
    id: true,
    timestamps: true,
    versionKey: 'version',
  }
);

export const ToDo = models.ToDo || model('ToDo', ToDoSchema);

// export interface ToDoLayOut{
//   title: String,
//   content: String,
//   startDate: Date,
//   dueDate: Date,
//   taskStatus: {
//     type: String,
//     enum: ToDoStatus,
//     default: ToDoStatus.PENDING,
//     required: true
//   }
// }
