import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings, Maximize, Minimize, X } from 'lucide-react';
import { BackToTopButton } from '../ui/BackToTopButton';

interface FloatingActionMenuProps {
  isFocusMode: boolean;
  onFocusToggle: () => void;
  onSettingsClick: () => void;
}

export const FloatingActionMenu = ({
  isFocusMode,
  onFocusToggle,
  onSettingsClick,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isFocusMode) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={onFocusToggle}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Minimize className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  const handleSettingsClick = () => {
    onSettingsClick();
    setIsOpen(false);
  };

  return (
    <>
    <BackToTopButton />
    <div className="fixed bottom-20 right-5 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1.5 rounded-full bg-background/80 backdrop-blur-md border-primary/20">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onFocusToggle}
              className="rounded-full w-10 h-10"
            >
              <Maximize className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettingsClick}
              className="rounded-full w-10 h-10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    </>
  );
};
