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
import { Button } from "@/components/ui/button";
import { Share1Icon } from "@radix-ui/react-icons";

const pageCount = 410;

export const BookInterior = () => {
  const textBlockRef = useRef(null);
  const { setBookOpen, cellHex: cellHex, bookState, page, setPage } = gameController();
  const exitBook = () => {
    setPage(undefined)
    setBookOpen(false);
    setScreenLocked(false);
  };

  return page && (
    <Dialog open onOpenChange={exitBook}>
      <DialogContent
        className="max-w-full max-h-screen p-8 mt-10 sm:mt-auto w-max flex flex-col bg-no-repeat bg-cover"
        onEscapeKeyDown={exitBook}
        onPointerDownOutside={exitBook}
        onInteractOutside={exitBook}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:"url('textures/paperBackground.jpg')"
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
               generateSeededText(page, cellHex, bookState)}
          </div>
          <div className="flex mt-4 m-8 flex-wrap sm:flex-nowrap justify-evenly gap-y-2">
            <Input  min={1} max={410} className="w-20" type="number" value={page} onChange={(e) => {
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
          <Button variant={'outline'}>
            <Share1Icon className="mr-2 h-4 w-4"/>Share</Button>
          </div>
      </DialogContent>
    </Dialog>
  );
};
