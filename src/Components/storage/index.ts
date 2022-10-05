import React from "react";
type StorageParams = {
  data?: {
    key: string;
    value: any;
  };
  key?: string;
};

type UseLocalStorage = (
  params: StorageParams
) => (never[] | React.Dispatch<React.SetStateAction<never[]>>)[];

export const useLocalStorage: UseLocalStorage = (params) => {
  const [data, setData] = React.useState<null | any>();
  React.useEffect(() => {
    if (params.key) {
      //search in the storage
      const localdata = localStorage.getItem(params.key);
      setData(localdata);
    }
    if (params.data?.key) {
      //add data
      const stringifyValue = JSON.stringify(params.data.value);
      localStorage.setItem(params.data?.key, stringifyValue);
    }

    return () => {
      setData(null);
    };
  }, [params]);

  return [data, setData];
};
