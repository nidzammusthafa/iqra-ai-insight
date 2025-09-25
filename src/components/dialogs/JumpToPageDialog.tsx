
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JumpToPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJump: (page: number) => void;
}

export const JumpToPageDialog = ({ open, onOpenChange, onJump }: JumpToPageDialogProps) => {
  const [pageInput, setPageInput] = useState("");

  const handleJump = () => {
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= 604) {
      onJump(page);
      onOpenChange(false);
      setPageInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lompat ke Halaman</DialogTitle>
          <DialogDescription>
            Masukkan nomor halaman antara 1 dan 604.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="page-number" className="text-right">
              Halaman
            </Label>
            <Input
              id="page-number"
              type="number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="col-span-3"
              min={1}
              max={604}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleJump}>Lompat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
