export const fetchToLocalStorage = (key: string) => {
  const data = localStorage.getItem(key);
  if (!data) return null;
  const parsedData = JSON.parse(data);
  return parsedData;
};

export const saveToLocalStorage = (key: string, value: any) => {
  try {
    console.log(value);
    const stringifyValue = JSON.stringify(value);
    localStorage.setItem(key, stringifyValue);
  } catch (e) {
    throw new Error(`${e}`);
  }
};
