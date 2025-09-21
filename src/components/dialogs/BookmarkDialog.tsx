import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark } from "@/types/quran";
import { BookmarkPlus, Tag } from "lucide-react";

interface BookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  verseText: string;
  verseTranslation: string;
  existingBookmark?: Bookmark;
  onSave: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
}

export const BookmarkDialog = ({
  open,
  onOpenChange,
  surahNumber,
  verseNumber,
  surahName,
  verseText,
  verseTranslation,
  existingBookmark,
  onSave
}: BookmarkDialogProps) => {
  const [note, setNote] = useState(existingBookmark?.note || "");
  const [tags, setTags] = useState(existingBookmark?.tags?.join(", ") || "");

  const handleSave = () => {
    const bookmarkData = {
      surahNumber,
      verseNumber,
      surahName,
      verseText,
      verseTranslation,
      note: note.trim() || undefined,
      tags: tags.trim() ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : undefined
    };

    onSave(bookmarkData);
    onOpenChange(false);
    
    // Reset form
    setNote("");
    setTags("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookmarkPlus className="w-5 h-5 text-primary" />
            <span>{existingBookmark ? 'Edit Bookmark' : 'Tambah Bookmark'}</span>
          </DialogTitle>
          <DialogDescription>
            QS. {surahName} : {verseNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Verse Preview */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="arabic-text text-sm">{verseText}</div>
            <div className="text-muted-foreground text-sm">{verseTranslation}</div>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Catatan (Opsional)</Label>
            <Textarea
              id="note"
              placeholder="Tambahkan catatan pribadi untuk ayat ini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-primary" />
              <Label htmlFor="tags">Tag (Opsional)</Label>
            </div>
            <Input
              id="tags"
              placeholder="doa, motivasi, hukum (pisahkan dengan koma)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Gunakan tag untuk mengelompokkan bookmark
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button onClick={handleSave}>
              {existingBookmark ? 'Update' : 'Simpan'} Bookmark
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};