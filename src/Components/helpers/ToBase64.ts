/**
 * Convert file to base 64 format
 * @param file
 * @returns a Promise containing of base64 image data and old properties
 */

import { BufferData } from "../types";

export const ConvertToBase64 = async (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise<BufferData>((resolve, reject) => {
    try {
      reader.onloadend = () => {
        resolve({
          data: reader.result,
          name: file.name,
          lastSize: file.size,
          arrayBuffer: file.arrayBuffer,
          slice: file.slice,
          stream: file.stream,
          text: file.text,
          type: file.type,
          webkitRelativePath: file.webkitRelativePath,
        });
      };
    } catch (e) {
      reject(e);
    }
  });
};
