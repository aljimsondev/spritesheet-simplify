import { BufferData } from "../Components/types";
import { ConvertToBase64 } from "./ToBase64";

/**
 * Loads all the converted base 64 files
 * @param files
 * @returns
 */
async function LoadBase64Images(files: FileList) {
  let arr: BufferData[] = [];
  for (let key in Object.keys(files)) {
    arr.push(await ConvertToBase64(files[key]));
  }
  return arr;
}

export default LoadBase64Images;
