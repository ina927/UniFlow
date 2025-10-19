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
    <div className="absolute top-4 right-4 flex gap-2">
      <Link href="/timer">
        <button className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light">
          Timer
        </button>
      </Link>
      <button
        onClick={() => setConfirmOpen(true)}
        className="px-4 py-2 bg-button-deactive-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
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