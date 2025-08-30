import { Switch } from "@/components/ui/switch";
import styles from "@/widgets/assessments/AssessmentControls.module.css";


type Props = {
    checked: boolean;
    onToggle: () => void;
}

export default function RequiredMarkToggle({ checked, onToggle }: Props) {
    return (
        <div className={styles.requiredMarkToggle}>
            <Switch id="required-marks" checked={checked} onCheckedChange={onToggle} />
            <label htmlFor="required-marks" className="text-body1-semibold text-primary">
                view required marks
            </label>
        </div>
    );
}