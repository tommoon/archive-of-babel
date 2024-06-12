import { KeyboardControls } from "@react-three/drei";
import Ecctrl from "ecctrl";

export const Player = () => {
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

  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl
        camInitDis={-0.01}
        camMinDis={-0.01}
        camFollowMult={100}
        turnVelMultiplier={1}
        turnSpeed={100}
        mode="CameraBasedMovement"
      />
    </KeyboardControls>
  );
};
