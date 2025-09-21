import { Book, BookOpen, Search, Settings } from "lucide-react";
import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
}

const navItems = [
  {
    label: "Qur'an",
    icon: BookOpen,
    path: "/",
    activePattern: /^\/$/
  },
  {
    label: "Hadits", 
    icon: Book,
    path: "/hadits",
    activePattern: /^\/hadits/
  },
  {
    label: "Cari",
    icon: Search,
    path: "/search", 
    activePattern: /^\/search/
  },
  {
    label: "Pengaturan",
    icon: Settings,
    path: "/settings",
    activePattern: /^\/settings/
  }
];

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();

  return (
    <div className="mobile-container">
      {/* Main content area with bottom padding for navigation */}
      <main className="pb-20 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav animate-slide-in-right backdrop-blur-md bg-card/95 shadow-lg">
        <div className="flex justify-around items-center py-2 px-4 animate-fade-in">
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
                <span className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};