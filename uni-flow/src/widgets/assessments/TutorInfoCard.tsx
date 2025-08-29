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
        <span className="text-body1 underline">
          {tutorEmail}
        </span>
      </p>
      <p className="text-body1-bold">
        Coordinator:{' '}
        <span className="text-body1 underline">
          {coordinatorEmail}
        </span>
      </p>
    </div>
  );
}