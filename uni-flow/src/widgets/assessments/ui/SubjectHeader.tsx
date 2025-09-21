import styles from "./SubjectHeader.module.css"; 

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
            <h1 className="text-large-title-bold text-primary"> 
                {subjectName} [{subjectCode}] 
            </h1> 
            <p className="text-title3 text-tertiary"> 
                {term} {year} 
                <span> / </span> 
                {creditPoint} credit point 
            </p> 
        </header> 
    ); 
}
