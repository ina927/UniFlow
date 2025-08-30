import SubjectHeader from "@/widgets/assessments/SubjectHeader";
import TutorInfoCard from "@/widgets/assessments/TutorInfoCard";
import AssessmentControls from "@/widgets/assessments/AssessmentControls";
import styles from "./page.module.css";

export default function AssessmentsPage(){ 
    const exampleSubject = { 
        subjectName: "Advanced Software Development", 
        subjectCode: "41026", term: "Spring", year: 2025, 
        creditPoint: 6, 
    } 
    const exampleTutorInfo = {
        tutorEmail: "dyer.david@uts.edu.au",
        coordinatorEmail: "hua.zuo@uts.edu.au",
    };
    
    return ( 
        <div className={styles.container}>
            <div className={styles.left}> 
                <SubjectHeader {...exampleSubject}/>
                <AssessmentControls/>
                {/* AssessmentTable */} 
            </div>
            <div className={styles.right}> 
                <TutorInfoCard {...exampleTutorInfo} />
                {/* GradeSummary */} 
            </div> 
        </div>
    ); 
}