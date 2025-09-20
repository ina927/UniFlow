import styles from "./TutorInfoCard.module.css";

type TutorInfoProps = {
  tutorEmail: string;
  coordinatorEmail: string;
};

export default function TutorInfoCard({ tutorEmail, coordinatorEmail }: TutorInfoProps) {
  return (
    <div className={styles.tutorBox}>
      <p className="text-body1-bold">
        Tutor:{' '}
         <a
          className="text-body1 underline"
          href={`mailto:${tutorEmail}`}
        >
          {tutorEmail}
        </a>
      </p>
      <p className="text-body1-bold">
        Coordinator:{' '}
        <a
          className="text-body1 underline"
          href={`mailto:${coordinatorEmail}`}
        >
          {coordinatorEmail}
        </a>
      </p>
    </div>
  );
}