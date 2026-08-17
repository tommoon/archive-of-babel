const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Deep structural equality. Used to compare cell coordinates, which are small
 * flat objects, so the recursive walk is cheap.
 */
export const _objectIsEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (!isRecord(obj1) || !isRecord(obj2)) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !_objectIsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
