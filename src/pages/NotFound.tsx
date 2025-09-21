import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Halaman tidak ditemukan
          </p>
          <p className="text-muted-foreground">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full max-w-xs">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full max-w-xs">
            <Link to="/search">
              Cari Ayat atau Surah
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
