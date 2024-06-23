import { setScreenLocked, setSelectedSeed } from "@/Controllers/gameController";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { TextBlock } from "./components/TextBlock";

const pageCount = 10;

export const BookInterior = ({ selectedSeed }: { selectedSeed: string }) => {
  const [page, setPage] = useState(1);

  const exitBook = () => {
    setSelectedSeed(null);
    setScreenLocked(false);
  };
  return (
    <Dialog open onOpenChange={exitBook}>
      <DialogContent
        className="min-w-[95%] p-8"
        onEscapeKeyDown={exitBook}
        onPointerDownOutside={exitBook}
        onInteractOutside={exitBook}
        onClick={(e) => e.stopPropagation()}
      >
        <AspectRatio ratio={16 / 9}>
          <div className="flex flex-col h-full">
            <div className="flex font-mono text-xs gap-8 m-8 grow">
              <TextBlock
                seed={`${selectedSeed.replace("-", "1")}${page.toString()}`}
              />
              <TextBlock
                seed={`${selectedSeed.replace("-", "1")}${(page + 1).toString()}`}
              />
            </div>
            <div className="flex mt-4 m-8">
              <div>{page}</div>
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setPage(page - 2)} />
                    </PaginationItem>
                  )}
                  {[0, 2, 4].map((futurePages) => {
                    return page + futurePages <= pageCount ? (
                      <PaginationItem key={futurePages}>
                        <PaginationLink
                          onClick={() => setPage(page + futurePages)}
                          isActive={futurePages === 0}
                        >{`${page + futurePages} - ${page + futurePages + 1}`}</PaginationLink>
                      </PaginationItem>
                    ) : null;
                  })}
                  {page + 4 < pageCount - 1 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {page < pageCount - 1 && (
                    <PaginationItem>
                      <PaginationNext onClick={() => setPage(page + 2)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
              <div>{page + 1}</div>
            </div>
          </div>
        </AspectRatio>
      </DialogContent>
    </Dialog>
  );
};
