export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (keys: string[]): (string | null)[] => {
  return keys.map((key) => localStorage.getItem(key));
};
