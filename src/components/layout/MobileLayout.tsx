import { Book, BookOpen, Search } from "lucide-react";
import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/hooks/useFocusModeHook";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { SettingsSheet } from "@/components/settings/SettingsSheet";
import { BackToTopButton } from "@/components/ui/BackToTopButton";

interface MobileLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Qur'an",
    icon: BookOpen,
    path: "/",
    activePattern: /^\/$/,
  },
  {
    label: "Hadits",
    icon: Book,
    path: "/hadits",
    activePattern: /^\/hadits/,
  },
  {
    label: "Cari",
    icon: Search,
    path: "/search",
    activePattern: /^\/search/,
  },
];

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const { isFocusMode, setIsFocusMode } = useFocusMode();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="mobile-container">
      {/* Main content area with bottom padding for navigation */}
      <main className={cn("min-h-screen", !isFocusMode && "pb-20")}>
        {children}
      </main>

      {/* Floating Action Menu is always visible, but its content changes based on focus mode */}
      <FloatingActionMenu
        isFocusMode={isFocusMode}
        onFocusToggle={() => setIsFocusMode(!isFocusMode)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <BackToTopButton />

      {/* Bottom Navigation and Settings Sheet are hidden in focus mode*/}
      {!isFocusMode && (
        <>
          <SettingsSheet
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
          />
          <nav className="bottom-nav animate-slide-in-right backdrop-blur-md bg-card/95 shadow-lg">
            <div className="flex justify-around items-center py-2 pl-4 pr-12 animate-fade-in">
              {navItems.map((item) => {
                const isActive = item.activePattern.test(location.pathname);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-300 hover-scale",
                      isActive
                        ? "text-primary bg-primary-light animate-scale-in shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/80 hover:shadow-sm"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 mb-1 transition-transform",
                        isActive && "scale-110"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive && "font-semibold"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};
