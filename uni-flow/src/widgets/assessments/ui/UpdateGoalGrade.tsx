import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Grade } from "@/entities/assessments/enums";
import { updateSubjectGoalGrade } from "@/features/academics/apis";

import styles from "./GradeSummary.module.css";

export const UpdateGoalGrade = ({ subjectId, goal, refetch }: { 
  subjectId: string, 
  goal: Grade, 
  refetch: () => void 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(goal);
  
  const handleSaveGoalGrade = async () => {
    try {
      setIsLoading(true);
      const gradeMap: { [key: string]: number } = { 'HD': 85, 'D': 75, 'C': 65, 'P': 50 };
      await updateSubjectGoalGrade(subjectId, gradeMap[selectedGrade]);
      setIsEditDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to update goal grade:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
    <DialogTrigger asChild>
      <button
        type="button"
        className={styles.editButton}
        aria-label="Edit goal grade"
      >
        <Pencil size={18} />
      </button>
    </DialogTrigger>
    <DialogContent aria-describedby="">
      {isLoading && 
      <div className={styles.overlay}>
        <Loader2 className={`${styles.spinner} h-8 w-8 text-white`} />
      </div>
      }
      <DialogHeader>
        <DialogTitle>Edit Goal Grade</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Goal Grade</label>
          <Select 
            defaultValue={selectedGrade}
            onValueChange={(v) => {
              setSelectedGrade(v as Grade);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a grade" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Grade).filter((grade) => grade !== Grade.F).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveGoalGrade}>Save Changes</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
}
