import { Card } from '@/components/ui/card';

interface CurrentTimeCardProps {
  currentTime: Date;
}

export const CurrentTimeCard = ({ currentTime }: CurrentTimeCardProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-soft border-0">
      {/* Islamic Calligraphy Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
          <path 
            d="M50 100 Q100 50 150 100 T250 100 Q300 150 350 100" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="none"
            className="animate-pulse"
          />
          <circle cx="80" cy="80" r="3" fill="currentColor" opacity="0.6"/>
          <circle cx="120" cy="120" r="2" fill="currentColor" opacity="0.4"/>
          <circle cx="280" cy="70" r="4" fill="currentColor" opacity="0.5"/>
          <circle cx="320" cy="130" r="3" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      
      <div className="relative text-center space-y-2">
        <div className="text-4xl font-bold tracking-wider font-mono drop-shadow-lg">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm opacity-90 drop-shadow">
          {formatDate(currentTime)}
        </div>
      </div>
    </Card>
  );
};