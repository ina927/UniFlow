
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { getSubjects } from "@/features"
import { SubjectEntity } from "@/entities"

export function Combobox({ academicCourseId, onSubjectChange }: { academicCourseId: string; onSubjectChange: (subjectId: string) => void; }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { data } = useQuery({
    queryKey: ["subjects", academicCourseId],
    queryFn: () => getSubjects(academicCourseId),
    staleTime: 5 * 60 * 1000,
  });
  
  const subjects = data?.data?.data || [];

  return (
    <div style={{display: "flex", flexDirection: "row",float: "right", marginLeft: "5vw", paddingLeft:"1vw", paddingRight: "1vw"}} className="text-title3-bold">
        <Popover open={open} onOpenChange={setOpen}>
        <h3 style={{marginTop: "0.8vh", paddingRight: "1vw", marginLeft: "-1vw"}}>Subject: </h3>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {value
            ? subjects.find((subject: SubjectEntity) => subject.id === value)?.title
            : "Select subject..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search subject..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {subjects.map((subject: SubjectEntity) => (
                <CommandItem
                  key={subject.id}
                  value={subject.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    // parent call
                    onSubjectChange(currentValue === value? "": currentValue)
                  }}
                >
                  {subject.title}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === subject.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
    
  )
}
