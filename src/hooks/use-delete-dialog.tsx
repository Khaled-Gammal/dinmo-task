"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface UseConfirmMessageProps {
  onConfirm: (...args: any[]) => Promise<string>;
  title?: string;
  text?: string;
  successMessage?: string;
}

type UseConfirmMessageReturn = [(...args: any[]) => void, JSX.Element];

export const useConfirmMessage = ({
  onConfirm,
  title = "Delete Items",
  text = "Are you sure you want to delete this item?",
  successMessage = "Item deleted successfully",
}: UseConfirmMessageProps): UseConfirmMessageReturn => {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<any[] | null>(null);

  const handleOpen = (...params: any[]) => {
    setArgs(params);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const viewMessage = (message?: string) => {
    toast.success(message || successMessage);
  };

  const dialog = (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:w-[549px] w-full px-[60px] py-[24px] flex items-center flex-col gap-4">
        <DialogHeader className="gap-[22px]">
          <DialogTitle className="flex flex-row items-center justify-center gap-1">
            <p className="p-2 bg-green-300 rounded-full">
              <Trash2 size={18} />
            </p>
            <p className="header-title">{title}</p>
          </DialogTitle>
          <DialogDescription className="sub-title-gray text-center">
            {text}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-between gap-6 md:gap-[60px] w-full">
          <Button
            className="cancel-button w-full"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="confirm-button w-full"
            onClick={async () => {
              try {
                await onConfirm(...(args || []));
                viewMessage(successMessage);
                handleClose();
              } catch (err: any) {
                viewMessage("An error occurred");
              }
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [handleOpen, dialog];
};
