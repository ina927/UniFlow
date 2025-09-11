
import { ToDoStatus } from "@/entities/enums/ToDoStatus"

export interface ToDoEntity{
    title: String,
    content: String,
    startDate: Date,
    dueDate: Date,
    taskStatus: { 
      type: String, 
      enum: ToDoStatus, 
      default: ToDoStatus.PENDING, 
      required: true 
    }
  }
  