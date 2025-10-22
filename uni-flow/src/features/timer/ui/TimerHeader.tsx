import Link from "next/link";
import { Button } from "@/shared/ui/button";

type TimerHeaderProps = {
  showAddTodoForm?: boolean;
  onToggleSettings: () => void;
  showSettings: boolean;
  onToggleAddTodo?: () => void;
};

const TimerHeader = ({
  showAddTodoForm,
  onToggleSettings,
  showSettings,
  onToggleAddTodo
}: TimerHeaderProps) => {
  return (
    <div className="fixed mt-6 right-4 top-[80px] z-40 flex flex-col items-center gap-2">
      {/* History Page */}
      <Link href="/history">
        <Button className="w-40 bg-[var(--primary-dark)]">
          View History
        </Button>
      </Link>

      {/* Settings Toggle */}
      <Button onClick={onToggleSettings} variant="bordered" className="w-40 border-[var(--primary-dark)] text-[var(--primary-dark)] hover:bg-[var(--primary-dark)]">
        {showSettings ? "Close Settings" : "Settings"}
      </Button>
    </div>
  );
};

export default TimerHeader;
