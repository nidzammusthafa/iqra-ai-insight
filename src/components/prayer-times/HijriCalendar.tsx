import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Calendar as CalendarLucide } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HijriDate {
  gregorian: string;
  hijri: string;
  day: string;
  month: string;
  year: string;
}

interface HijriCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const HijriCalendar = ({ onDateSelect, selectedDate }: HijriCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const convertToHijri = (date: Date): HijriDate => {
    // Simple Hijri conversion (approximate)
    // In a real app, you'd use a proper Hijri calendar library
    const hijriMonths = [
      'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
      'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
      'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
    ];
    
    // Approximate conversion (for demo purposes)
    const hijriYear = Math.floor((date.getFullYear() - 622) * 1.030684) + 1;
    const monthIndex = (date.getMonth() + Math.floor(Math.random() * 2)) % 12;
    
    return {
      gregorian: format(date, 'dd MMMM yyyy'),
      hijri: `${date.getDate()} ${hijriMonths[monthIndex]} ${hijriYear} H`,
      day: date.getDate().toString(),
      month: hijriMonths[monthIndex],
      year: hijriYear.toString()
    };
  };

  const hijriDate = convertToHijri(selectedDate);

  return (
    <Card className="p-4 bg-gradient-secondary shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Kalender Hijriah</h3>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "dd MMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateSelect(date);
                    setIsOpen(false);
                  }
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <div className="text-center p-3 bg-card rounded-lg border">
            <div className="text-sm text-muted-foreground">Tarikh Masehi</div>
            <div className="font-semibold text-foreground">{hijriDate.gregorian}</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-primary text-primary-foreground rounded-lg">
            <div className="text-sm opacity-90">Tarikh Hijriah</div>
            <div className="font-semibold font-arabic text-lg">{hijriDate.hijri}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};