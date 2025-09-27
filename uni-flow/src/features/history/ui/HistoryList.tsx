import HistoryCard from "@/features/history/ui/HistoryCard";

type Session = {
  id: string;
  subject?: string;
  taskTitle?: string;
  taskStatus?: string;
  duration: number;
  startTime: string;
  endTime: string;
};

type HistoryListProps = {
  history: Session[];
};

const HistoryList = ({ history }: HistoryListProps) => {
  return (
    <div className="w-full h-full px-6">
      <span className="text-title2-bold text-primary mb-4 block">Tasks</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh] overflow-y-auto">
        {history.map((session) => (
          <HistoryCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;