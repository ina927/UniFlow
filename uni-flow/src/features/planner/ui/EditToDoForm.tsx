// Library
'use client';

import { useEffect, useState } from 'react';

import { ToDoEntity } from '@/entities/todos/entities';
import { ToDoStatus } from '@/entities/todos/enums';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ComboboxForm } from '@/widgets/planner/SetSubjectModalForm';
import { updateToDo } from '../apis/todo.api';
import styles from './AddToDoForm.module.css';

// type setup
type editToDoFormProps = {
  academicCourseId: any;
  event: ToDoEntity;
  isOpen: boolean; // Add this
  onClose: () => void; // Add this
  refresh: () => void;
};

// export function
export const EditToDoForm = ({
  academicCourseId,
  event,
  isOpen,
  onClose,
  refresh,
}: editToDoFormProps) => {
  // if (!event) return null;

  // form state
  const [eventTitle, setEventTitle] = useState<string>(event?.title || '');
  const [description, setDescription] = useState<string>(
    event?.description || ''
  );
  const [startDate, setStartDate] = useState<Date | null>(
    event?.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(event?.endDate || null);
  const [subjectId, setSubjectId] = useState<string>(event?.subjectId || '');
  const [error, setError] = useState<string | null>(null);

  // // user data
  // const userId = useUserId();

  // use handler
  useEffect(() => {
    if (event) {
      setEventTitle(event.title);
      setDescription(event.description);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setSubjectId(event.subjectId);
    }
  }, [event]); // Add dependency array

  // event handler
  const validateSave = async () => {
    if (!event) {
      console.log('Error fetching data');
      return;
    }

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
      return;
    }

    // for start date
    const now = new Date();
    if (startDate) {
      const startDateFormat = new Date(startDate);
      if (isNaN(startDateFormat.getTime())) {
        setError('Start date is not detected');
        return;
      }
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
        id: event.id,
        subjectId: subjectId,
        assessmentId: '',
        title: eventTitle,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: ToDoStatus.PENDING, // default settings
      };

      await updateToDo(newToDo);
      console.log('Updated event:', newToDo);
      refresh();
      onClose(); // Use the onClose prop
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
      <DialogContent aria-describedby={'editToDoForm'}>
        <br />
        <DialogHeader>
          <DialogTitle className='text-title3-bold'>Edit Task</DialogTitle>
        </DialogHeader>
        <form className={styles.toDoForm}>
          {error && <div className='text-red-500'>{error}</div>}

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
              value={
                startDate ? new Date(startDate).toISOString().split('T')[0] : ''
              }
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
              value={
                endDate ? new Date(endDate).toISOString().split('T')[0] : ''
              }
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
            Update
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
