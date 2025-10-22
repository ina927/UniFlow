// Library
import { useEffect, useState } from 'react';

import { ToDoStatus } from '@/entities/todos/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ComboboxForm } from '@/widgets/planner/SetSubjectModalForm';
import { postEvents } from '../apis/todo.api';
import styles from './AddToDoForm.module.css';
import { Label, Input, Button, Textarea } from '@/shared/ui';

// type setup
type addToDoFormProps = {
  academicCourseId: any;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
};

// export function
export const AddToDoForm = ({
  academicCourseId,
  isOpen,
  onClose,
  refresh,
}: addToDoFormProps) => {
  // form state
  const [eventTitle, setEventTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [subjectId, setSubjectId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // use handler
  useEffect(() => {
    if (isOpen) {
      setEventTitle('');
      setDescription('');
      setStartDate(null);
      setEndDate(null);
      setSubjectId('');
      setError(null);
    }
  }, [isOpen]);

  // event handler
  const validateSave = async (e: React.FormEvent) => {
    // Title validator
    if (eventTitle.trim() === '' || !eventTitle) {
      setError('Empty title is detected');
      return;
    }

    // Description auto fill
    if (description.trim() === '' || !description) {
      setDescription('This is a generated description');
    }

    // Date validator
    if (!endDate || !startDate) {
      setError('Date is not detected');
    }

    // for start date
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (startDate) {
      const startDateFormat = new Date(startDate);
      if (isNaN(startDateFormat.getTime())) {
        setError('Start date is not detected');
        return;
      }
      startDateFormat.setHours(0, 0, 0, 0);
      if (startDateFormat < now) {
        setError('Please choose today or the day after');
        return;
      }
    }

    // for end date
    if (endDate && startDate) {
      const startDateFormat = new Date(startDate);
      const endDateFormat = new Date(endDate);
      if (isNaN(endDateFormat.getTime())) {
        setError('End date is not detected');
        return;
      }
      endDateFormat.setHours(0, 0, 0, 0);
      if (endDateFormat < now || endDateFormat < startDateFormat) {
        setError('Please choose the later day');
        return;
      }
    } else {
      setError('Choose a day to start and finish');
      return;
    }

    setError(null);
    // reconstruction steps
    if (endDate !== null && startDate !== null) {
      const newToDo = {
        subjectId: subjectId,
        assessmentId: '',
        title: eventTitle,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: ToDoStatus.PENDING, // default settings
      };

      await postEvents(newToDo);

      refresh();
      onClose();
      setDescription('');
      setEventTitle('');
      setStartDate(null);
      setEndDate(null);
      setSubjectId('');
    } else {
      console.log('Error in posting');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent aria-describedby={'addToDoForm'} className={styles.modal}>
        <DialogHeader>
          <DialogTitle className='text-title3-bold'>Add New Task</DialogTitle>
        </DialogHeader>
        <form
          className={styles.formGrid}
          onSubmit={(e) => e.preventDefault()}
        >
        {error && (
          <div className={styles.formItemFull}>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}
          {/* title input */}
          <div className={styles.formItemFull}>
            <Label htmlFor="todo-edit-title">Title *</Label>
            <Input
              id="todo-edit-title"
              type="text"
              placeholder="Enter task title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>

          {/* Description input */}
          <div className={styles.formItemFull}>
            <Label htmlFor="todo-edit-desc">Description / memo</Label>
            <Textarea
              id="todo-edit-desc"
              placeholder="Add description (optional)"
              value={description}
              maxLength={150}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          {/* Start/End Date Input */}
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Label htmlFor="todo-edit-start">Start date *</Label>
              <Input
                id="todo-edit-start"
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                required
              />
            </div>
            <div className={styles.formItem}>
              <Label htmlFor="todo-edit-deadline">Deadline *</Label>
              <Input
                id="todo-edit-deadline"
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                required
              />
            </div>
          </div>

          {/* SubjectId Input */}
          <div className={styles.formItemFull}>
            <Label htmlFor="todo-edit-subject">Subject *</Label>
            <ComboboxForm
              academicCourseId={academicCourseId}
              subjectId={subjectId}
              onSubjectChange={(sid: string) => sid && setSubjectId(sid)}
            />
          </div>

          <hr />

          {/* Save Button */}
          <div className={styles.footer}>
            <Button type="button" variant="outline" onClick={() => onClose()}>Cancel</Button>
            <Button type="button" onClick={validateSave}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
