import Link from 'next/link';

import { Combobox } from '@/widgets/planner/SetFilterModal';
import styles from '@/features/planner/ui/PlannerHeader.module.css'
import { useUserId } from '@/shared/stores';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// type setup
type PlannerHeaderProps = {
  academicCourseId: string;
  onSubjectFilterChange: (subjectId: string | null) => void;
  mode?: 'todo' | 'calendar';
};

// PLANNER HEADER ONLY
export const PlannerHeader = ({
  academicCourseId,
  onSubjectFilterChange,
  mode='todo',
}: PlannerHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isCalendar = mode === 'calendar' || pathname.includes('/calendar');
  const [view, setView] = useState<'todo' | 'calendar'>(isCalendar ? 'calendar' : 'todo');

  const handleViewChange = (next: 'todo' | 'calendar') => {
    if (!next || next === view) return;
    setView(next);
    if (next === 'calendar') router.push('../calendar');
    else router.push('../planner');
  };

  const handleSubjectFilterChange = (subjectId: string) => {
    onSubjectFilterChange(subjectId || null);
  };
  const [name, setName] = useState<string>("");

  const getUserDetails = async() => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (res.status === 401) {
          return;
        }
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || '');
        }
      } catch {

      } finally {

      }
    }

    const userId = useUserId();

    useEffect(() => {
      if (!userId) return;

      let active = true;
      (async () => {
        try {
          const res = await fetch('/api/user/me', { cache: 'no-store' });
          if (res.status === 401) return;
          const data = await res.json();
          if (active && data.user) {
            setName(data.user.name || '');
          }
        } catch {

        } finally {

        }
      })();

      return () => {
        active = false;
      };
    }, [userId]);
      return (
    <div className={styles.header}>
    <div className={styles.topRow}>
      <h1 className="text-large-title-bold">
        {name}&#39;s Study {isCalendar ? 'Calendar' : 'Planner'}
      </h1>

      <div className={styles.filter}>
        <Combobox
          academicCourseId={academicCourseId}
          onSubjectChange={handleSubjectFilterChange}
        />
      </div>
    </div>

    <div
      className={styles.toggleRow}
    >
      <ToggleGroup
        type="single"
        value={view}
        aria-label="Planner view mode"
        className="flex justify-center"
        onClick={() => handleViewChange(view === 'todo' ? 'calendar' : 'todo')}
      >
        <ToggleGroupItem
          value="todo"
          className="text-title3-bold data-[state=on]:bg-[var(--background-prime)] data-[state=on]:text-[var(--background)] h-[40px] px-4"
        >
          Todo view
        </ToggleGroupItem>
        <ToggleGroupItem
          value="calendar"
          className="text-title3-bold data-[state=on]:bg-[var(--background-prime)] data-[state=on]:text-[var(--background)] h-[40px] px-4"
        >
          Calendar view
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
  );
};
