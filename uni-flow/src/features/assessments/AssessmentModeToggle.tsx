import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import styles from "@/widgets/assessments/AssessmentControls.module.css";

type Props = {
    mode: "view" | "whatif";
    onChange: (mode: "view" | "whatif") => void;
}

export default function AssessmentModeToggle({ mode, onChange }: Props){
    return (
        <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(val) => {
                if (val) onChange(val as "view" | "whatif")
            }}
        >
            <ToggleGroupItem value="view">View Mode</ToggleGroupItem>
            <ToggleGroupItem value="whatif">What-if Mode</ToggleGroupItem>
        </ToggleGroup>
    )
}