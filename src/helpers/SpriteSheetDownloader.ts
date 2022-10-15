export function SpriteSheetDownload(
  spritesheet: HTMLImageElement,
  options?: {
    fileName: string;
    fileType: "png" | "jpg";
  }
) {
  if (spritesheet && spritesheet.src !== "data:,") {
    const a = document.createElement("a");
    a.download = `${options?.fileName || "spritesheet"}.${
      options?.fileType || "png"
    }`;
    a.href = spritesheet.src;
    a.click();
  }
}
