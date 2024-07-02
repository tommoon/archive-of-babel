import { LibraryCorridor } from "@/props/LibraryCorridor";
import { LibraryMainRoom } from "@/props/LibraryMainRoom";
import { PerspectiveCamera as DreiPerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils, PerspectiveCamera } from "three";

const BackgroundProps = () => (
  <>
    <fogExp2 attach={"fog"} args={["black", 0.1]} />
    <LibraryMainRoom
      hasLights={true}
      hasColliders={false}
      cellLocation={{ x: 0, y: 0, z: 0 }}
    />
    <LibraryCorridor
      hasLights={true}
      hasColliders={false}
      cellLocation={{ x: 0, y: 0, z: 0 }}
      orientation="N"
    />
    <LibraryCorridor
      hasLights={true}
      hasColliders={false}
      cellLocation={{ x: 0, y: 0, z: 0 }}
      orientation="S"
    />
    <LibraryMainRoom
      hasColliders={false}
      cellLocation={{ x: 0, y: 0, z: -1 }}
    />
    <LibraryCorridor
      hasColliders={false}
      cellLocation={{ x: 0, y: 0, z: -1 }}
      orientation="S"
    />
  </>
);

const MenuCamera = () => {
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [targetZ, setTargetZ] = useState(8);
  const [atBottom, setAtBottom] = useState(false);

  const handleScroll = (event: WheelEvent) => {
    if (!atBottom) {
      setScrollPosition((prev) => Math.min(0, prev - event.deltaY * 0.005));
    }
  };

  const checkScrollBottom = () => {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    setAtBottom(isAtBottom);
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("scroll", checkScrollBottom);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", checkScrollBottom);
    };
  }, [atBottom]);

  useFrame(() => {
    if (cameraRef.current) {
      setTargetZ(8 + scrollPosition);
      cameraRef.current.position.z = MathUtils.lerp(
        cameraRef.current.position.z,
        targetZ,
        0.1,
      );
    }
  });

  return (
    <DreiPerspectiveCamera
      makeDefault
      ref={cameraRef}
      position={[0, 0.8, 8]}
    />
  );
};

export const Background = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <Canvas className="w-full h-full">
        <color attach="background" args={["black"]} />
        <MenuCamera />
        <BackgroundProps />
      </Canvas>
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 pointer-events-none" />
    </div>
  );
};
