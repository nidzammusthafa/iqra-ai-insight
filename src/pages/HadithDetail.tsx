import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSingleHadith, getHaditsInfo } from "@/services/haditsApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { HadithCard } from "@/components/hadits/HadithCard";
import { HadithInfo } from "@/types/hadits";

export const HadithDetail = () => {
  const { rawi, haditsNumber } = useParams<{ rawi: string; haditsNumber: string }>();
  const navigate = useNavigate();

  const haditsNum = parseInt(haditsNumber || "1");

  const { data: hadithData, isLoading: isLoadingHadith, error: errorHadith } = useQuery({
    queryKey: ["hadith", rawi, haditsNum],
    queryFn: () => getSingleHadith(rawi!, haditsNum),
    enabled: !!rawi && !!haditsNum,
  });

  const { data: haditsInfo, isLoading: isLoadingInfo } = useQuery<{
    data: HadithInfo[];
  }>({ 
    queryKey: ["haditsInfo"], 
    queryFn: getHaditsInfo 
  });

  const currentRawiInfo = haditsInfo?.data.find(info => info.slug === rawi);
  const totalHadits = currentRawiInfo?.total || 0;

  const goToPreviousHadith = () => {
    if (haditsNum > 1) {
      navigate(`/hadits/${rawi}/${haditsNum - 1}`);
    }
  };

  const goToNextHadith = () => {
    if (totalHadits && haditsNum < totalHadits) {
      navigate(`/hadits/${rawi}/${haditsNum + 1}`);
    }
  };

  if (errorHadith) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-destructive mb-2">Gagal memuat hadits.</p>
          <p className="text-muted-foreground text-sm mb-4">
            Hadits tidak ditemukan atau terjadi kesalahan jaringan.
          </p>
          <Button onClick={() => navigate("/hadits")} variant="outline">
            Kembali ke Daftar Hadits
          </Button>
        </div>
      </div>
    );
  }

  const hadith = hadithData?.data;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky-header animate-fade-in">
        <div className="p-4 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/hadits")}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="font-semibold text-foreground text-lg capitalize">
              {currentRawiInfo?.name || rawi}
            </h1>
            <p className="text-sm text-muted-foreground">
              Hadits No. {haditsNum}
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousHadith}
              disabled={haditsNum <= 1}
              className="text-muted-foreground hover:text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextHadith}
              disabled={isLoadingInfo || haditsNum >= totalHadits}
              className="text-muted-foreground hover:text-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoadingHadith ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-muted-foreground">Memuat hadits...</span>
          </div>
        ) : hadith ? (
          <HadithCard hadith={hadith} rawiName={currentRawiInfo?.name || rawi!} />
        ) : null}
         <div className="h-8" />
      </div>
    </div>
  );
};
