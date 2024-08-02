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
      demo={true}
      hasColliders={false}
      cellHex={{ x: "0", y: "0", z: "0" }}
    />
    <LibraryCorridor
      demo={true}
      hasColliders={false}
      cellHex={{ x: "0", y: "0", z: "0" }}
      orientation="N"
    />
    <LibraryCorridor
      demo={true}
      hasColliders={false}
      cellHex={{ x: "0", y: "0", z: "0" }}
      orientation="S"
    />
    <LibraryMainRoom
      demo={true}
      hasColliders={false}
      cellHex={{ x: "0", y: "0", z: "-1" }} />
    <LibraryCorridor
      hasColliders={false}
      cellHex={{ x: "0", y: "0", z: "-1" }}
      orientation="S"
    />
  </>
);

const MenuCamera = () => {
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const [targetZ, setTargetZ] = useState(0);

  const checkScrollBottom = () => {
    const bottomY = document.body.offsetHeight - window.innerHeight;
    const percentDownPage = (window.scrollY / bottomY);
    setTargetZ(-10*percentDownPage)
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollBottom);

    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
    };
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
       cameraRef.current.position.z = MathUtils.lerp(
        cameraRef.current.position.z,
        targetZ + 8,
        0.1
      ); 
    }
  });

  return (
    <DreiPerspectiveCamera makeDefault ref={cameraRef} position={[0, 0.8, 8]} />
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
    </div>
  );
};
