import { useEffect, useRef } from "react";

const deepCompareEquals = (
  a: { [key: string]: any },
  b: { [key: string]: any },
): boolean => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key) || !deepCompareEquals(a[key], b[key]))
      return false;
  }
  return true;
};

export const useWhyDidYouUpdate = (
  name: string,
  props: { [key: string]: any },
) => {
  const previousProps = useRef(props);

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj: { [key: string]: { from: any; to: any } } = {};
      allKeys.forEach((key) => {
        if (!deepCompareEquals(previousProps.current[key], props[key])) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changesObj).length) {
        console.log(`[${name}] component updated:`, changesObj);
      }
    }
    previousProps.current = props;
  });
};
