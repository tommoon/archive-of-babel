import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export const useAssetsLoading = () => {
  const { progress } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(progress !== 100);
  }, [progress]);

  return loading;
};
