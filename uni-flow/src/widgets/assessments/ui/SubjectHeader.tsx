import styles from "./SubjectHeader.module.css"; 
import { Pencil } from "lucide-react";  

type SubjectHeaderProps = { 
    subjectName: string; 
    subjectCode: string; 
    term: string; 
    year: number; 
    creditPoint: number; 
}; 

export const SubjectHeader = (props: SubjectHeaderProps) => { 
    const { subjectName, subjectCode, term, year, creditPoint } = props; 
    
    return (
        <header className={styles.subjectInfoGroup}>
            <div className={styles.textGroup}>
                <h1 className="text-large-title-bold text-primary">
                {subjectName} [{subjectCode}]
                </h1>
                <p className="text-title3 text-tertiary">
                {term} {year}
                <span> / </span>
                {creditPoint} credit point
                </p>
            </div>
            {/* <button
                type="button"
                className={styles.editButton}
                aria-label="Edit subject info"
            >
                <Pencil size={18} />
            </button> */}
        </header>
    ); 
}
