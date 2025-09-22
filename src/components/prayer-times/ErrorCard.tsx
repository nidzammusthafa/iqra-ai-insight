import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ErrorCardProps {
  error: string;
}

export const ErrorCard = ({ error }: ErrorCardProps) => {
  return (
    <Card className="p-6 border-destructive/20 bg-destructive/5">
      <div className="flex items-center space-x-3 text-destructive">
        <AlertTriangle className="w-6 h-6" />
        <div>
          <h3 className="font-semibold">Terjadi Kesalahan</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    </Card>
  );
};