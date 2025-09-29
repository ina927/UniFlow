
import { ToDoStatus } from "@/entities/enums/ToDoStatus"

export interface ToDoEntity{
    id: String,
    title: String,
    subjectId: string
    description: String,
    startDate: Date,
    endDate: Date,
    status: { 
      type: String, 
      enum: ToDoStatus, 
      default: ToDoStatus.PENDING, 
      required: true 
    }
  }
  