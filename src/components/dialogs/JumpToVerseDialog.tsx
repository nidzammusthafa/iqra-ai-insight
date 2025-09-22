import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface JumpToVerseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maxVerse: number;
  onJump: (verseNumber: number) => void;
}

export const JumpToVerseDialog = ({
  open,
  onOpenChange,
  maxVerse,
  onJump,
}: JumpToVerseDialogProps) => {
  const [verseInput, setVerseInput] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verseNum = parseInt(verseInput, 10);

    if (isNaN(verseNum) || verseNum < 1 || verseNum > maxVerse) {
      toast({
        variant: 'destructive',
        title: 'Nomor Ayat Tidak Valid',
        description: `Silakan masukkan nomor antara 1 dan ${maxVerse}.`,
      });
      return;
    }

    onJump(verseNum);
    onOpenChange(false);
    setVerseInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lompat ke Ayat</DialogTitle>
          <DialogDescription>
            Masukkan nomor ayat yang ingin Anda tuju (1 - {maxVerse}).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="number"
            placeholder={`Nomor ayat (1-${maxVerse})`}
            value={verseInput}
            onChange={(e) => setVerseInput(e.target.value)}
            className="mt-2"
            autoFocus
          />
          <DialogFooter className="mt-4">
            <Button type="submit">Lompat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
