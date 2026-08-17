import { BookState, gameController } from "@/Controllers/gameController";
import { PositionalAudio, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { Euler, Quaternion, Vector3, PositionalAudio as ThreePositionalAudio } from "three";
import { Camera } from "./Camera";
import { useCellHex } from "@/hooks/useCellHex";
import { degrees_to_radians } from "@/lib/utils";
import { touchController } from "@/Controllers/touchController";
import { optionsController } from "@/Controllers/optionsController";
import footsteps from '@/assets/sounds/footstep.mp3'
import { Orientation } from "@/types/CommonTypes";
import { playerPos } from "@/lib/playerPosition";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const startPos = new Vector3(3, 1, 5);

const getStartingPos = (bookState: BookState | undefined) => {
  if (!bookState) return startPos;
  switch (bookState.cabinet) {
    case 0:
      return new Vector3(1.6, 1, 1.6);
    case 1:
      return new Vector3(4.4, 1, 1.6);
    case 2:
      return new Vector3(4.4, 1, 4.4);
    case 3:
      return new Vector3(1.6, 1, 4.4);
    default:
      return startPos;
  }
};

const getRoomRotation = (cabinet: number | undefined) => {
  switch (cabinet) {
    case 0:
      return 45;
    case 1:
      return 315;
    case 2:
      return 225;
    case 3:
      return 135;
    default:
      return 0;
  }
};
  
const getInitialPosition = (bookState: BookState | undefined, adjustedPosition: Vector3,  painting: Orientation | undefined) => {
  if (!bookState) return adjustedPosition;
  if (painting) {
      const vector = new Vector3();
      if (['N', 'S'].includes(painting)) {
        vector.setZ('N' === painting ? -7.5 : 3.5)
      } else {
        vector.setX('E' === painting ? -5.5 : 5.5)
        vector.setZ(-2.5)
      }
      return adjustedPosition.clone().add(vector);
  } else {
    let unitAdjustment = 0;
    if (bookState.unit !== undefined) {
      if (bookState.cabinet === 0) {
        unitAdjustment = bookState.unit - 2;
      } else {
        unitAdjustment = 2 - bookState.unit;
      }
    }
    const quat = new Quaternion().setFromEuler(new Euler(0, degrees_to_radians(getRoomRotation(bookState.cabinet)), 0));
    const vector = new Vector3(unitAdjustment * 0.447, 0, 0).applyQuaternion(quat);
    return adjustedPosition.clone().add(vector);
  }
};

const getInitialRotation = (bookState: BookState | undefined, painting: Orientation | undefined) => {
    if (!bookState) return new Euler(0, 0, 0);
 
  if (painting) {
    return new Euler(0, ['N', 'S'].includes(painting) ? Math.PI / 2 : 0, 0)
  } else {
    let y = getRoomRotation(bookState?.cabinet);
    if (bookState?.book !== undefined) {
      const starting = 15 - (bookState.book * 3.3);
      y += starting;
    }
    // Initial Y-axis rotation
    const initialQuat = new Quaternion().setFromEuler(new Euler(0, degrees_to_radians(y), 0));
    const initialRotation = new Euler().setFromQuaternion(initialQuat);

    // Check if we need to tilt the camera down
    if (bookState.row !== undefined) {
      // Apply a local rotation of -10 degrees around the X-axis
      const rowDegrees = -32 + (bookState.row * 16)
      const tiltQuat = new Quaternion().setFromEuler(new Euler(degrees_to_radians(rowDegrees), 0, 0));
      initialQuat.multiplyQuaternions(initialQuat, tiltQuat);
      initialRotation.setFromQuaternion(initialQuat);
    }

    return initialRotation;
  }
};

export const Player = () => {
  const ref = useRef<RapierRigidBody>(null);
  const footstepAudio = useRef<ThreePositionalAudio>(null);
  const [, get] = useKeyboardControls();
  const { cellHex, bookState, painting } = gameController();
  const { move, pan } = touchController();
  const { fov, fxVol } = optionsController()
  const { adjustedPosition } = useCellHex({ cellHex, addition: getStartingPos(bookState) });

  // Spawn placement is deliberately computed once on mount: recomputing it while
  // the player is moving would teleport them back to the entry point.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialPosition = useMemo(() => getInitialPosition(bookState, adjustedPosition, painting), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialRotation = useMemo(() => getInitialRotation(bookState, painting), []);
  
  useEffect(() => {
    const footstepAudioListener = footstepAudio.current

    const alterAudio = () => {
      if (footstepAudioListener) {
        const tune = Math.random() * 600 - 300
        footstepAudioListener.setDetune(tune)
      }
    };

    // Set interval to play audio every second
      const intervalId = setInterval(alterAudio, 500);
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);

  }, [footstepAudio])
  
  useFrame((state) => {
    if (ref.current && footstepAudio.current) {
      const { forward = 0, backward = 0, leftward = 0, rightward = 0 } = get();
      const velocity = ref.current.linvel();
      const rigidBodyTranslation = ref.current.translation();
      playerPos.set(
        rigidBodyTranslation.x,
        rigidBodyTranslation.y + 0.2,
        rigidBodyTranslation.z,
      );
      state.camera.position.set(
        rigidBodyTranslation.x,
        rigidBodyTranslation.y + 0.2,
        rigidBodyTranslation.z,
      );
      // @ts-expect-error - useKeyboardControls() returns booleans; arithmetic on them is intentional
      frontVector.set(0, 0, backward - forward + move.dy * 0.01);
      // @ts-expect-error - see above
      sideVector.set(leftward - rightward - move.dx * 0.01, 0, 0);
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(state.camera.rotation);
      ref.current.setLinvel(
        {
          x: direction.x,
          y: velocity.y,
          z: direction.z,
        },
        true,
      );

      const tiltQuat = new Quaternion().setFromEuler(new Euler(pan.dy * -0.01, 0, 0));
      state.camera.rotateOnWorldAxis(new Vector3(0,1,0),pan.dx * -0.01)
      state.camera.quaternion.multiply(tiltQuat)

      // Check if the player is moving and control footstep sound
      if (direction.length() > 0) {
        if (!footstepAudio.current.isPlaying) {
          footstepAudio.current.setLoop(true);
          footstepAudio.current.play();
        }
      } else {
        footstepAudio.current.setLoop(false);
      }
    }
  });

  return cellHex ? (
    <group>
      <Camera initialRotation={initialRotation} fov={fov} />
      <RigidBody
        canSleep={false}
        ref={ref}
        colliders={false}
        type="dynamic"
        enabledRotations={[false, false, false]}
        position={initialPosition}
      >
        <CapsuleCollider args={[0.2, 0.18]} />
        {/* Attach footstep sound */}
        <PositionalAudio ref={footstepAudio} url={footsteps} distance={fxVol * 2} />
      </RigidBody>
    </group>
  ) : null;
};
