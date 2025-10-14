
import { ToDoStatus } from "@/entities/enums/ToDoStatus"

export interface ToDoEntity{
    id: string,
    title: string,
    subjectId: string,
    assessmentId: string,
    description:string,
    startDate: Date,
    endDate: Date,
    status: ToDoStatus
  }
  
export interface ToDoVital{
  title: string,
  subjectId: string,
  assessmentId: string,
  description: string,
  startDate: Date,
  endDate: Date,
  status: ToDoStatus
}