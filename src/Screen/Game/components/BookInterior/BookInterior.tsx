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
import { useRef } from "react";
import { generateSeededText } from "@/lib/randomFunctions";
import { Input } from "@/components/ui/input";
import paper from "@/assets/images/paperBackground.jpg";
import { ShareButton } from "../ShareButton";

const pageCount = 410;

export const BookInterior = () => {
  const textBlockRef = useRef(null);
  const { setBookOpen, cellHex: cellHex, bookState, page, searchString, setPage, setSearchstring } = gameController();
  const exitBook = () => {
    setPage(undefined);
    setSearchstring(null);
    setBookOpen(false);
    setScreenLocked(false);
  };

  return page && (
    <Dialog open onOpenChange={exitBook}>
      <DialogContent
        className="max-w-full sm:max-h-screen p-8 max-h-[90vh] h-[90vh] sm:mt-auto w-max flex flex-col bg-no-repeat bg-cover"
        onEscapeKeyDown={exitBook}
        onPointerDownOutside={exitBook}
        onInteractOutside={exitBook}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:`url(${paper})`
        }}
      >
          <div
            ref={textBlockRef}
            className="flex-grow font-mono text-xs gap-8 mx-auto my-8 overflow-y-auto w-fit break-all"
            style={{ 
              maxWidth: "80vw",
              width: "40rem",
            }}
          >
            {cellHex &&
            generateSeededText(page, cellHex, bookState, searchString).map((part, i) => 
              <span key={i} style={part.toLowerCase() === searchString && searchString.toLowerCase() ? { fontWeight: 'bold', color: 'red' } : {} }>
                  { part }
              </span>
            )
          }
          </div>
          <div className="flex mt-4 m-8 flex-wrap sm:flex-nowrap justify-evenly gap-y-2">
            <Input autoFocus={false}  min={1} max={410} className="w-20" type="number" value={page} onChange={(e) => {
              e.preventDefault()
              setPage(parseInt(e.target.value))
              }} />
            <Pagination className="order-first sm:order-none">
              <PaginationContent>
                {page > 0 && (
                  <PaginationItem>
                    {page !== 1 && <PaginationPrevious onClick={() => setPage(page - 1)} />}
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
                    {page !== 410 && <PaginationNext onClick={() => setPage(page + 1)} />}
                  </PaginationItem>
                )}
              </PaginationContent>
          </Pagination>
          <ShareButton/>
          </div>
      </DialogContent>
    </Dialog>
  );
};
