type Session = {
  id: string;
  subject?: string;
  taskTitle?: string;
  taskStatus?: string;
  duration: number;
  startTime: string;
  endTime: string;
};

type HistoryCardProps = {
  session: Session;
};

const HistoryCard = ({ session }: HistoryCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-primary-light p-4 flex flex-col justify-between h-48">
      <h3 className="text-body1-bold text-primary mb-2">{session.taskTitle}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Subject: <span className="font-medium">{session.subject}</span>
      </p>
      <div className="mt-auto text-sm text-gray-700">
        <p>Duration: {(session.duration / 60).toFixed(0)} mins</p>
        <p>
          {new Date(session.startTime).toLocaleTimeString()} →{" "}
          {new Date(session.endTime).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;