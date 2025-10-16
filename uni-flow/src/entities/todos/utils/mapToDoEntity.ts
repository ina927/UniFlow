import { ToDoEntity } from '@/entities/todos/entities';
import { ToDoStatus } from '@/entities/todos/enums';

export function mapToToDoEntity(data: any): ToDoEntity {
  return {
    id: data.id,
    title: data.title,
    subjectId: data.subjectId || '',
    assessmentId: data.assessmentId || '',
    description: data.description || '',
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    status: data.status as ToDoStatus,
  };
}
