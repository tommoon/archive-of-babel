export const _objectIsEqual = (obj1: any, obj2: any): boolean => {
  // Check if both arguments are objects
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return obj1 === obj2;
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the number of keys is different
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if values corresponding to each key are equal
  for (let key of keys1) {
    if (!keys2.includes(key) || !_objectIsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};
