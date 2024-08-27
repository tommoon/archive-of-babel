import { Dialog, DialogContent } from "@/components/ui/dialog";
import { gameController, setScreenLocked } from "@/Controllers/gameController";
import { ShareButton } from "./ShareButton";

export const PaintingInterior:React.FC<{image: HTMLCanvasElement}> = ({image}) => {
    const {  setPainting, setImage } = gameController();
    const exitBook = () => {
      setPainting(undefined);
      setImage(null);
      setScreenLocked(false);
    };
    const imageDataURL = image.toDataURL();

    return image && (
      <Dialog open onOpenChange={exitBook}>
            <DialogContent
          style={{ backgroundImage: `url(${imageDataURL})` }} 
          className="max-w-full sm:max-h-screen p-8 max-h-[90vh] h-[90vh] sm:mt-auto w-max flex flex-col bg-no-repeat bg-cover aspect-[5/7]"
          onEscapeKeyDown={exitBook}
          onPointerDownOutside={exitBook}
          onInteractOutside={exitBook}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
          onClick={(e) => e.stopPropagation()}
        >
                <div
                    className={"absolute bottom-10 right-10"}>
                <ShareButton/>
            </div>
        </DialogContent>
    </Dialog>
    )
}