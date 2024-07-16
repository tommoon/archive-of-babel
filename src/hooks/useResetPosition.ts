import { useEffect } from "react";

export const useResetPosition = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
