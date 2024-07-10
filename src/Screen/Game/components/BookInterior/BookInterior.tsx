import { gameController, setScreenLocked } from "@/Controllers/gameController";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRef, useState } from "react";
import { generateSeededText } from "@/lib/randomFunctions";
import { Input } from "@/components/ui/input";

const pageCount = 410;

export const BookInterior = () => {
  const [page, setPage] = useState(1);
  const textBlockRef = useRef(null);
  const { setBookOpen, cellHex: cellHex, bookState } = gameController();
  const exitBook = () => {
    setBookOpen(false);
    setScreenLocked(false);
  };
  console.log(bookState)
  return (
    <Dialog open onOpenChange={exitBook}>
      <DialogContent
        className="max-w-screen max-h-screen p-8 w-max"
        onEscapeKeyDown={exitBook}
        onPointerDownOutside={exitBook}
        onInteractOutside={exitBook}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div
            ref={textBlockRef}
            className="flex-grow font-mono text-xs gap-8 m-8 overflow-y-auto w-fit break-all"
            style={{
              height: "40rem",
              maxHeight: "calc(100vh - 200px)",
              maxWidth: "80vw",
              width: "40rem",
            }}
          >
            {cellHex &&
               generateSeededText(page, cellHex, bookState)}
          </div>
          <div className="flex mt-4 m-8">
            <Input min={1} max={410} className="w-20" type="number" value={page} onChange={(e) => setPage(parseInt(e.target.value))} />
            <Pagination>
              <PaginationContent>
                {page > 0 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(page - 1)} />
                  </PaginationItem>
                )}
                {[0, 1, 2].map((futurePages) => {
                  return page + futurePages <= pageCount ? (
                    <PaginationItem key={futurePages}>
                      <PaginationLink
                        onClick={() => setPage(page + futurePages)}
                        isActive={futurePages === 0}
                      >{`${page + futurePages}`}</PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}
                {page < pageCount && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(page + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
