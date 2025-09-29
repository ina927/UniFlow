import { Switch } from "@/shared/ui/switch";
import styles from "@/widgets/assessments/ui/AssessmentControls.module.css";


type Props = {
    checked: boolean;
    onToggle: (next: boolean) => void;
}

export const RequiredMarkToggle = ({ checked, onToggle }: Props) => {
    return (
        <div className={styles.requiredMarkToggle}>
            <Switch id="required-marks" checked={checked} onCheckedChange={onToggle} />
            <label htmlFor="required-marks" className="text-body1-semibold text-primary">
                view required marks
            </label>
        </div>
    );
}
