import { useEffect, useRef } from "react";

const deepCompareEquals = (
  a: { [x: string]: any },
  b: { [x: string]: any }
) => {
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

export const useWhyDidYouUpdate = (name: any, props: { [x: string]: any }) => {
  const previousProps = useRef(props);

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
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
