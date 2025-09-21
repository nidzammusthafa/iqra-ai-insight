import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHadithList, getHaditsInfo } from "@/services/haditsApi";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Hadith,
  HadithInfo,
  HadithInfoResponse,
  HadithListResponse,
} from "@/types/hadits";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMemo } from "react";
import { Combobox } from "@/components/ui/combobox";

const HadithListItem = ({ hadith, rawi }: { hadith: Hadith; rawi: string }) => {
  const navigate = useNavigate();
  return (
    <Card
      className="mb-2 hover:bg-accent hover:cursor-pointer transition-colors"
      onClick={() => navigate(`/hadits/${rawi}/${hadith.number}`)}
    >
      <CardContent className="p-4 flex items-center">
        <span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold">
          {hadith.number}
        </span>
        <p className="ml-4 text-muted-foreground flex-1 truncate">
          {hadith.id.substring(0, 80)}...
        </p>
      </CardContent>
    </Card>
  );
};

export const HadithList = () => {
  const { rawi } = useParams<{ rawi: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const size = 20;

  const {
    data: haditsResponse,
    isLoading,
    error,
  } = useQuery<HadithListResponse>({
    queryKey: ["hadithList", rawi, page],
    queryFn: () => getHadithList(rawi!, page, size),
    enabled: !!rawi,
  });

  const { data: haditsInfo } = useQuery<HadithInfoResponse>({
    queryKey: ["haditsInfo"],
    queryFn: getHaditsInfo,
  });

  const currentRawiInfo = useMemo(
    () => haditsInfo?.data.find((info: HadithInfo) => info.slug === rawi),
    [haditsInfo, rawi]
  );

  const totalPages = useMemo(
    () => (currentRawiInfo ? Math.ceil(currentRawiInfo.total / size) : 0),
    [currentRawiInfo, size]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo(0, 0);
    }
  };

  const getPaginationRange = (
    currentPage: number,
    totalPages: number,
    siblingCount = 1
  ) => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);

      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
    return [];
  };

  const paginationRange = useMemo(
    () => getPaginationRange(page, totalPages),
    [page, totalPages]
  );

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Gagal memuat daftar hadits.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky-header animate-fade-in">
        <div className="p-4 flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/hadits")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground text-lg capitalize">
              {currentRawiInfo?.name || rawi}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentRawiInfo
                ? `${currentRawiInfo.total} hadits`
                : "Memuat..."}
            </p>
          </div>

          <Combobox
            options={Array.from(
              { length: currentRawiInfo?.total || 0 },
              (_, i) => ({
                value: (i + 1).toString(),
                label: `Hadits No. ${i + 1}`,
              })
            )}
            onChange={(value) => {
              if (value) {
                navigate(`/hadits/${rawi}/${value}`);
              }
            }}
            placeholder="Lompat ke No."
            searchPlaceholder="Cari nomor hadits..."
            className="max-w-[150px]"
          />
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {haditsResponse?.data.map((hadith: Hadith) => (
                <HadithListItem
                  key={hadith.number}
                  hadith={hadith}
                  rawi={rawi!}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={
                        page <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === "...") {
                      return <PaginationEllipsis key={index} />;
                    }

                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber as number);
                          }}
                          isActive={pageNumber === page}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
};
