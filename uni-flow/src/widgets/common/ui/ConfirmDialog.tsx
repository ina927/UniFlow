"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
};

export const ConfirmDialog = ({
    open,
    onOpenChange,
    title = "Change confirmation",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
}: ConfirmDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[420px]">
            <DialogHeader>
            <DialogTitle className="text-title3-bold">{title}</DialogTitle>
            </DialogHeader>

            <p className="text-body1 text-primary">{message}</p>

            <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
                {cancelText}
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
