"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Axios } from "axios"
import { useEffect } from "react"

// hard coded 
const frameworks = [
  {
    value: "bf6b6f0a-aeaf-4ab9-8c46-74b24ed90473", // is the subject ID
    label: "ASD", // the name only
  },
  {
    value: "504667bf-b7af-4f7f-b707-249c135914c3",
    label: "DotNet",
  },
  {
    value: "9e068d0f-038b-4e97-a8d2-5a298a244ece",
    label: "test",
  },
  {
    value: "c03df0f5-4f21-46c8-acf1-425d6804339a",
    label: "FID",
  },
]

export function Combobox({ academicCourseId, onSubjectChange }: { academicCourseId: string; onSubjectChange: (subjectId: string) => void; }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [subjects, setSubjects] = React.useState<string[]>([]);

//   useEffect(() => {
//     const fetchSubject = async () => {
//         // const response = await fetch('http://localhost:3000/api/subjects', {
//         //     headers: {
//         //       'academic-course-id': academicCourseId,
//         //     }
//         // });

//         // const jsonified = await response.json();
//         // setSubjects(jsonified);
//         // console.log("hello" + subjects) -> currently not working due to no connection established between subject and academic course
//       }
    
//       if (academicCourseId){
//         fetchSubject();
//       }
//   }, [academicCourseId])

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
            ? frameworks.find((framework) => framework.value === value)?.label
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
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    // parent call
                    onSubjectChange(currentValue === value? "": currentValue)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
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
