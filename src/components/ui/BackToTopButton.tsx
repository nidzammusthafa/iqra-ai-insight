import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";

export const BackToTopButton = () => {
  const isVisible = useScroll(400); // Show button after scrolling 400px

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-36 right-5 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "rounded-full shadow-lg transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};
