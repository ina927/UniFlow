"use client";

import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

type Mode = "view" | "whatif";
type Props = {
    mode: "view" | "whatif";
    onChange: (m: Mode) => void; 
}

/**
 * AssessmentModeToggle
 * Controlled toggle for switching between "view" and "whatif" modes.
 */
export const AssessmentModeToggle = ({ mode, onChange }: Props) => {
    const flip = () => onChange?.(mode === "view" ? "whatif" : "view");

    return (
        <ToggleGroup
            type="single"
            value={mode}
            onValueChange={() => flip()}
            aria-label="Mode"
        >
        <ToggleGroupItem
            value="view"
            className="data-[state=on]:bg-[var(--primary)] data-[state=on]:text-white"
        >
            View Mode
        </ToggleGroupItem>

        <ToggleGroupItem
            value="whatif"
            className="data-[state=on]:bg-[var(--primary)] data-[state=on]:text-white"
        >
            What-If Mode
        </ToggleGroupItem>
        </ToggleGroup>
    );
}
