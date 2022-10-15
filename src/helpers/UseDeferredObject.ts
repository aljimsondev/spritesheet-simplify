import React from "react";
export function useDeferredObject<T = {}>(obj: T, key: keyof T) {
  return React.useDeferredValue(obj[key]);
}
