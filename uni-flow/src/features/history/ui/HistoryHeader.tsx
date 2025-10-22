"use client";

import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/widgets/common/ui/ConfirmDialog";

type HistoryHeaderProps = {
  onClearHistory: () => void;
};

const HistoryHeader = ({ onClearHistory }: HistoryHeaderProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="fixed right-4 top-[80px] z-40 flex items-center gap-2">
      <Link href="/timer">
        <button className="px-4 py-2 bg-primary-light text-white rounded-full shadow text-body1-bold hover:bg-button-hover-light">
          Timer
        </button>
      </Link>
      <button
        onClick={() => setConfirmOpen(true)}
        className="px-4 py-2 bg-button-deactive-light text-white rounded-full shadow text-body1-bold hover:bg-button-hover-light"
      >
        Clear History
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(v) => setConfirmOpen(v)}
        title="Clear history"
        message="Are you sure you want to clear your study history? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={() => {
          onClearHistory();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default HistoryHeader;