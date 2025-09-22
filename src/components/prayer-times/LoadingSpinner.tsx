export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Memuat jadwal sholat...</p>
      </div>
    </div>
  );
};