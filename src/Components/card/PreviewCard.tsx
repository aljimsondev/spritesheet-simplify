import React from "react";
import { FaDownload } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";

import { IoPlayOutline } from "react-icons/io5";
import InlineGroup from "../group/InlineGroup";
import { SpriteSheetDownload } from "../../helpers/SpriteSheetDownloader";
import { Context } from "../../Store/store";
import Animate from "../../renderer/Animate";
import { PreviewCardProps } from "./types";
import PreviewCardDropdown from "../dropdown/PreviewCardDropdown";
import FpsRange from "../PreviewCardComponents/FpsRange";
import PreviewCardTitle from "../PreviewCardComponents/PreviewCardTitle";
import SpritesProperties from "../PreviewCardComponents/SpritesProperties";
import PreviewCardButton from "../button/PreviewCardButton";

const defaultProperty = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  name: "Title",
  arrayIndex: 0,
};

const PreviewCard: React.FC<PreviewCardProps> = (
  {
    buffer,
    backgroundColor,
    displayBackgroundColor,
    updateSpritesheetColumn,
    handleRemoveColumn,
    height,
    width,
    y,
    name,
    sourceIndex,
  },
  ref
) => {
  const frameXRenderRef = React.useRef<HTMLInputElement>(null);
  const defaultScreen = { height: 150, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const previewCardRef = React.useRef<HTMLDivElement>(null);
  const deferredBgColor = React.useDeferredValue(backgroundColor);
  const anim = new Animate();
  const { onUpdateProperties, properties } = React.useContext(Context);

  const [localProperties, setProperties] = React.useState<{
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
    arrayIndex: number;
    fps: number;
  }>({
    height: height,
    width: width,
    y: y,
    name: name,
    arrayIndex: sourceIndex,
    x: 0,
    fps: 60,
  });

  const [isPending, startTransition] = React.useTransition();

  //defer properties
  const deferredProperties = React.useDeferredValue(localProperties);
  //memoized deferred value
  const memoizedProperties = React.useMemo(
    () => deferredProperties,
    [deferredProperties, buffer]
  );

  const handlePlayingState = React.useCallback(() => {
    if (buffer) {
      anim.init(canvasRef.current!);
      anim.setFrameXTargetRef(frameXRenderRef.current!);
      anim.play(buffer, {
        fps: memoizedProperties.fps,
      });
    }
  }, [memoizedProperties.fps, buffer]);

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")!;
    if (buffer) {
      CreatePreviewThumbnail(
        buffer,
        {
          height: height,
          width: width,
          name: name,
        },
        ctx,
        defaultScreen.width,
        defaultScreen.height
      );
    }
    setProperties({
      ...localProperties,
      width: width,
      height: height,
      y: y,
      name: name,
    });

    return () => {
      //clean up
    };
  }, [backgroundColor, displayBackgroundColor]);

  const handleChangeFPS = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const val = parseFloat(e.target.value as string);
        setProperties({ ...localProperties, fps: val });
      } catch (e) {
        console.warn(e);
      }
    },
    [memoizedProperties.fps]
  );
  //TODO add json download for spritesheets properties

  const handleDownloadingSpriteSheet = React.useCallback(() => {
    if (buffer) {
      SpriteSheetDownload(buffer, {
        fileName: localProperties.name.split(".")[0],
        fileType: "png",
      });
    }
  }, [localProperties.name]);

  const handleSpritesheetWHProperties = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProperties({ ...localProperties, [e.target.name]: e.target.value });

      startTransition(() => {
        if (properties.updated) {
          onUpdateProperties("updated", false);
        }
      });
    },
    [memoizedProperties.height, memoizedProperties.width]
  );

  const onEnterKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      updateSpritesheetColumn(
        localProperties.arrayIndex,
        localProperties.width,
        localProperties.height
      );
      startTransition(() => {
        onUpdateProperties("updated", true);
      });
    }
  };

  return (
    <>
      <div className="preview-card" ref={previewCardRef}>
        <div ref={canvasWrapperRef} className="preview-canvas-base">
          <div
            className="preview-canvas"
            style={{
              background: displayBackgroundColor ? deferredBgColor : "none",
            }}
          >
            <canvas
              ref={canvasRef}
              height={defaultScreen.height}
              width={defaultScreen.width}
            ></canvas>
          </div>
        </div>
        <div className="preview-controller-base">
          <PreviewCardDropdown
            sourceIndex={sourceIndex}
            handleRemoveColumn={handleRemoveColumn}
          />
          <PreviewCardTitle
            text={JSON.parse(buffer?.dataset?.props || "Spritesheet").name}
          />
          <FpsRange
            fps={memoizedProperties.fps}
            handleChangeFPS={handleChangeFPS}
          />
          <SpritesProperties
            height={memoizedProperties.height}
            width={memoizedProperties.width}
            onChangeValue={handleSpritesheetWHProperties}
            onEnterKey={onEnterKeyboardEvent}
            x={memoizedProperties.x}
            y={y}
            ref={frameXRenderRef}
          />
          <InlineGroup className="justify-between items-center mt-2">
            <PreviewCardButton onClick={handleDownloadingSpriteSheet}>
              <FaDownload />
            </PreviewCardButton>
            <PreviewCardButton
              onClick={handlePlayingState}
              className="bg-secondaryBlue text-white"
            >
              <IoPlayOutline />
            </PreviewCardButton>
          </InlineGroup>
        </div>
      </div>
    </>
  );
};

export default PreviewCard;
