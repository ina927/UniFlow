"use client";

import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/widgets/common/ui/ConfirmDialog";
import { Button } from "@/shared/ui/button";

type HistoryHeaderProps = {
  onClearHistory: () => void;
};

const HistoryHeader = ({ onClearHistory }: HistoryHeaderProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="fixed mt-6 right-4 top-[80px] z-40 flex items-center gap-2">
      <div className="flex flex-col gap-2">
        <Link href="/timer">
          <Button className="w-40 bg-[var(--primary-dark)]">
            Timer
          </Button>
        </Link>
        <Button
          onClick={() => setConfirmOpen(true)}
          variant="bordered" className="w-40 border-[var(--primary-dark)] text-[var(--primary-dark)] hover:bg-[var(--primary-dark)]"
        >
          Clear History
        </Button>
      </div>
    
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