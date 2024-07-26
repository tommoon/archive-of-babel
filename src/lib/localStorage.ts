export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};
