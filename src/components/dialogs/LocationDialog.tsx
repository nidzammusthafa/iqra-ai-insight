
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
import { Label } from '@/components/ui/label';

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSave: (location: { city: string; country: string }) => void;
  currentLocation: { city: string; country: string } | null;
}

export function LocationDialog({ open, onOpenChange, onLocationSave, currentLocation }: LocationDialogProps) {
  const [city, setCity] = useState(currentLocation?.city || '');
  const [country, setCountry] = useState(currentLocation?.country || '');

  const handleSave = () => {
    if (city && country) {
      onLocationSave({ city, country });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Lokasi</DialogTitle>
          <DialogDescription>
            Masukkan kota dan negara untuk melihat jadwal sholat.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="city">Kota</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Jakarta" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Negara</Label>
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., Indonesia" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
