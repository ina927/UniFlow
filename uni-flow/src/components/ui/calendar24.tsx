"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar24() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal
                hover:bg-transparent hover:text-foreground   
                "
            >
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
                onSelect={(date) => {
                    setDate(date)
                    setOpen(false)
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
          defaultValue="23:59:00"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
