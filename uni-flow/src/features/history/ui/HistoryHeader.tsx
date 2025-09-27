import Link from "next/link";

type HistoryHeaderProps = {
  onClearHistory: () => void;
};

const HistoryHeader = ({ onClearHistory }: HistoryHeaderProps) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Link href="/timer">
        <button className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light">
          Timer
        </button>
      </Link>
      <button
        onClick={onClearHistory}
        className="px-4 py-2 bg-button-deactive-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
      >
        Clear History
      </button>
    </div>
  );
};

export default HistoryHeader;