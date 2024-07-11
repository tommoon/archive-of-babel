import { gameController } from "@/Controllers/gameController";
import { PointerLockControls } from "@react-three/drei"
import { useEffect, useRef } from "react";
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

export const DesktopController = () => {
    const pointerLockRef = useRef<PointerLockControlsImpl>(null);
    const { screenLocked } = gameController();

    useEffect(() => {
        if (pointerLockRef.current) {
          if (screenLocked) {
            setTimeout(() => {
              pointerLockRef.current?.unlock();
            }, 10);
          } else if (!screenLocked && !pointerLockRef.current.isLocked) {
            setTimeout(() => {
              pointerLockRef.current?.lock();
            }, 10);
          }
        }
    }, [screenLocked]);
    
    return <PointerLockControls ref={pointerLockRef} />
}