import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import { KeyboardControls, PointerLockControls, useProgress } from "@react-three/drei";
import { gameController } from "@/Controllers/gameController";
import { Vector3 } from "three";
import { BookInterior } from "./components/BookInterior/BookInterior";
import { Cell } from "./components/Cell/Cell";
import { useQueryString } from "@/hooks/useQueryString";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { MobileController } from "./components/MobileController";
import { optionsController } from "@/Controllers/optionsController";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { AdSenseAd } from "../Home/components/AdSenseAd";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

const PreLoadScreen:React.FC<{onStart:() => void}> = ({onStart}) => {
  const { active, progress, loaded, total } = useProgress();

  const [loadingMessage, setLoadingMessage] = useState<string | null>('preparing')
  const [loadingProgress, setProgress] = useState<number>(0)

  useEffect(() => { setLoadingMessage(`Loading assets (${loaded}/${total})`) }, [loaded, total])
  useEffect(() => { setProgress(progress*0.9) }, [progress])
  
  useEffect(() => {
    if ((progress === 100 || loaded === total)) {
      setLoadingMessage(`Control Initialization`)
      setTimeout(() => {
        setProgress(100)
        setLoadingMessage('Ready')
      },1500)
  }}, [ progress])
  
  return (
    <div onClick={(e) => e.stopPropagation()} className=" flex flex-col gap-y-8 fixed inset-0 h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <AdSenseAd dataAdSlot="7256317371" extraProps={
        {
          height: '250px',
          width: '100%'
        }
        } />
      <div className="flex flex-col gap-y-4 backdrop-blur-md p-16 rounded-md">
        <div className="flex flex-col">
          <progress className="progress progress-accent w-56" value={loadingProgress} max="100"></progress>
          <span className="text-white self-end">{loadingMessage}</span>
        </div>
        <button onClick={onStart} disabled={loadingMessage !== 'Ready'} className="btn btn-accent">Enter</button>
      </div>
    </div>
  );
};

export const Game = () => {
  const { debug, bookOpen } = gameController();
  const canvasRef = useRef(null);
  useQueryString();
  const pointerLockRef = useRef<PointerLockControlsImpl>(null);
  const { screenLocked } = gameController();
  const { isMobile } = optionsController();
  const [paused, setPaused] = useState(true)

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

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      disableBodyScroll(canvasElement);
    }
    return () => {
      if (canvasElement) {
        enableBodyScroll(canvasElement);
      }
    };
  }, [canvasRef]);

  useEffect(() => {
    if (bookOpen) {
      setPaused(false)
    }
  },[bookOpen])

  const startup = () => {
    setPaused(false)
  }

  return (
<HelmetProvider>
      <Helmet>
      <title>Archive of Babel - Play</title>
      <meta name="description" content="Explore a 3D Archive based on the Library of Babel" />
      <meta name="keywords" content="Library of babel, play, free game, infinite" />
      </Helmet>
      {paused && <PreLoadScreen onStart={startup} />}
    <KeyboardControls map={keyboardMap}>
      <Canvas ref={canvasRef} frameloop="demand">
          <color attach="background" args={["black"]} />
            <>
              <ambientLight intensity={1} />
              <directionalLight />
            </>
          {!debug && <fogExp2 attach={"fog"} args={["black", 0.1]} />}
          <Physics paused={bookOpen || paused} debug={debug}>
          <Player />
            <group position={new Vector3(3, 0, 3)}>
              <Cell />
            </group>
          </Physics>
          <PointerLockControls ref={pointerLockRef} />
      </Canvas>
        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
        {bookOpen && <BookInterior />}
        {isMobile && <MobileController />}
      </KeyboardControls>
      </HelmetProvider>
  );
};
