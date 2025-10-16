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

// type setup
type addToDoFormProps = {
  academicCourseId: string;
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
    if (endDate) {
      const endDateFormat = new Date(endDate);
      if (isNaN(endDateFormat.getTime())) {
        setError('End date is not detected');
        return;
      }
      endDateFormat.setHours(0, 0, 0, 0);
      if (endDateFormat < now) {
        setError('Please choose the later day');
        return;
      }
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
      <DialogContent aria-describedby={'addToDoForm'}>
        <br />
        <DialogHeader>
          <DialogTitle className='text-title3-bold'>Add New Task</DialogTitle>
        </DialogHeader>
        <form
          className={styles.toDoForm}
          onSubmit={(e) => e.preventDefault()}
        >
          {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}

          {/* title input */}
          <input
            className={styles.titleInput}
            type='text'
            placeholder='New Task'
            value={eventTitle}
            onChange={(event) => setEventTitle(event.target.value)}
            required
          />

          {/* Description input */}
          <textarea
            className={styles.descriptionInput}
            placeholder='Description (optional) (150 characters max)'
            value={description}
            maxLength={150}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          ></textarea>

          {/* Start Date Input */}
          <div className={styles.rowContainer}>
            <label className={styles.labels}>Start Date: </label>
            <input
              type='date'
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(event) => {
                const date = event.target.value;
                const newDate = new Date(date);
                setStartDate(newDate);
              }}
              required
            />
          </div>

          {/* End Date Input */}
          <div className={styles.rowContainer}>
            <label className={styles.labels}>Deadline: </label>
            <input
              type='date'
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(event) => {
                const date = event.target.value;
                const newDate = new Date(date);
                setEndDate(newDate);
              }}
              required
            />
          </div>

          {/* SubjectId Input */}
          <div className={styles.rowContainer}>
            <label className={styles.labels}>Subject: </label>
            <ComboboxForm
              academicCourseId={academicCourseId}
              subjectId={subjectId}
              onSubjectChange={(subjectId: string) => {
                if (subjectId) {
                  setSubjectId(subjectId);
                }
              }}
            />
          </div>

          <hr />

          {/* Save Button */}
          <button
            type='button'
            className={styles.handler}
            onClick={validateSave}
          >
            Create
          </button>

          {/* Cancel Button */}
          <button
            type='button'
            className={styles.handler}
            onClick={() => onClose()}
          >
            Cancel
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
