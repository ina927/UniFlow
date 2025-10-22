// src/features/planner/ui/EditToDoForm.tsx
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
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { ComboboxForm } from '@/widgets/planner/SetSubjectModalForm';
import { deleteToDo, updateToDo } from '../apis/todo.api';
import { ConfirmDialog } from '@/widgets/common/ui/ConfirmDialog';
import styles from './AddToDoForm.module.css';

type editToDoFormProps = {
  academicCourseId: any;
  event: ToDoEntity;
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
};

export const EditToDoForm = ({
  academicCourseId,
  event,
  isOpen,
  onClose,
  refresh,
}: editToDoFormProps) => {
  // form state
  const [eventTitle, setEventTitle] = useState<string>(event?.title || '');
  const [description, setDescription] = useState<string>(event?.description || '');
  const [startDate, setStartDate] = useState<Date | null>(event?.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(event?.endDate || null);
  const [subjectId, setSubjectId] = useState<string>(event?.subjectId || '');
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // sync when event changes
  useEffect(() => {
    if (event) {
      setEventTitle(event.title);
      setDescription(event.description);
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setSubjectId(event.subjectId);
    }
  }, [event]);

  const validateSave = async () => {
    if (!event) {
      console.log('Error fetching data');
      return;
    }

    if (eventTitle.trim() === '' || !eventTitle) {
      setError('Empty title is detected');
      return;
    }

    if (description.trim() === '' || !description) {
      setDescription('This is a generated description');
    }

    if (!endDate || !startDate) {
      setError('Date is not detected');
      return;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

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

    if (endDate !== null && startDate !== null) {
      const newToDo = {
        id: event.id,
        subjectId: subjectId,
        assessmentId: '',
        title: eventTitle,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: ToDoStatus.PENDING,
      };

      await updateToDo(newToDo);
      console.log('Updated event:', newToDo);
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

  const deleteEvent = async () => {
    await deleteToDo(event);
    console.log('Deleted');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={'editToDoForm'} className={styles.modal}>
        <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-title3-bold">Edit Task</DialogTitle>
          </DialogHeader>

          {error && (
            <div className={styles.formItemFull}>
              <div className="text-red-500 text-sm">{error}</div>
            </div>
          )}

          {/* Title */}
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

          {/* Description */}
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

          {/* Start/End */}
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Label htmlFor="todo-edit-start">Start date *</Label>
              <Input
                id="todo-edit-start"
                type="date"
                value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                required
              />
            </div>
            <div className={styles.formItem}>
              <Label htmlFor="todo-edit-deadline">Deadline *</Label>
              <Input
                id="todo-edit-deadline"
                type="date"
                value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div className={styles.formItemFull}>
            <Label htmlFor="todo-edit-subject">Subject *</Label>
            <ComboboxForm
              academicCourseId={academicCourseId}
              subjectId={subjectId}
              onSubjectChange={(sid: string) => sid && setSubjectId(sid)}
            />
          </div>

          {/* Footer buttons (right aligned) */}
          <div className={styles.footer}>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
            <Button type="button" onClick={validateSave}>
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete task?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          (async () => {
            await deleteEvent();
            setConfirmOpen(false);
          })();
        }}
      />
    </Dialog>
  );
};
