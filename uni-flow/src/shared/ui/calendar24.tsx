// src/components/ui/calendar24.tsx
"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Input } from "@/shared/ui/input";
import { CalendarSearchIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";

type Props = {
  value?: Date;
  onChange?: (date: Date | null) => void;
};

export const Calendar24 = ({ value, onChange }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState("23:59:00");

  // value prop sync
  React.useEffect(() => {
    if (value) setDate(value);
  }, [value]);

  // helper: merge date + time
  const emitChange = (d: Date | undefined, t: string) => {
    if (!d) {
      onChange?.(null);
      return;
    }
    const [hh, mm, ss] = t.split(":").map(Number);
    const merged = new Date(d);
    merged.setHours(hh ?? 0, mm ?? 0, ss ?? 0, 0);
    onChange?.(merged);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date-picker" className="w-40 justify-between font-normal">
              <CalendarSearchIcon />
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              startMonth={new Date(2025, 1, 1)}
              endMonth={new Date(2030, 12, 31)}
              onSelect={(d) => {
                setDate(d ?? undefined);
                setOpen(false);
                emitChange(d ?? undefined, time);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={(e) => {
            const t = e.target.value;
            setTime(t);
            emitChange(date, t);
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </div>
    </div>
  );
}
