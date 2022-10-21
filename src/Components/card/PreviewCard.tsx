import React from "react";
import { FaDownload } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import { AiOutlineEllipsis } from "react-icons/ai";
import { IoPlayOutline } from "react-icons/io5";
import InlineGroup from "../group/InlineGroup";
import DropdownMenu from "../dropdown/DropdownMenu";
import InputGroup from "../input/InputGroup";
import { SpriteSheetDownload } from "../../helpers/SpriteSheetDownloader";
import { Context } from "../../Store/store";
import Animate from "../../renderer/Animate";
import { PreviewCardProps } from "./types";
import Paragraph from "../typography/paragraph";
import InputRange from "../input/InputRange";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const defaultProperty = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  name: "Title",
  arrayIndex: 0,
};

//TODO refactor code
//APPly MEMO
const PreviewCard = React.forwardRef<HTMLInputElement, PreviewCardProps>(
  (
    {
      buffer,
      backgroundColor,
      displayBackgroundColor,
      updateSpritesheetColumn,
    },
    ref
  ) => {
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const [fps, setFps] = React.useState<number>(60);
    const playStateRef = React.useRef<HTMLButtonElement>(null);
    const frameXRenderRef = React.useRef<HTMLInputElement>(null);
    const defaultScreen = { height: 150, width: 120 };
    const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
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
    }>(defaultProperty);

    const [isPending, startTransition] = React.useTransition();
    const handlePlayingState = React.useCallback(() => {
      if (buffer) {
        anim.init(canvasRef.current!);
        anim.setFrameXTargetRef(frameXRenderRef.current!);
        anim.play(buffer, {
          fps: fps,
        });
      }
    }, [fps, buffer]);

    React.useEffect(() => {
      const ctx = canvasRef.current?.getContext("2d")!;
      if (buffer) {
        const props: {
          name: string;
          height: number;
          width: number;
          posY: number;
          arrayIndex: number;
        } = JSON.parse(buffer.dataset?.props!);

        CreatePreviewThumbnail(
          buffer,
          {
            height: props.height,
            width: props.width,
            name: props.name,
          },
          ctx,
          defaultScreen.width,
          defaultScreen.height
        );

        setProperties({
          ...localProperties,
          width: props.width,
          height: props.height,
          name: props.name,
          y: props.posY,
          arrayIndex: props.arrayIndex,
        });
      }

      return () => {
        //clean up
        setProperties(defaultProperty);
      };
    }, [backgroundColor, displayBackgroundColor]);

    const handleChangeFPS = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
          const val = e.target.value as string;
          setFps(parseFloat(val));
        } catch (e) {
          console.warn(e);
        }
      },
      [fps]
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
      [localProperties.height, localProperties.width]
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
          <React.Fragment>
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
              <div className="relative flex-grow flex items-center justify-end">
                <div ref={dropdownRef}>
                  <DropdownMenu
                    icon={<AiOutlineEllipsis size={25} />}
                    buttonClass="-icon-button"
                    dropdownRef={dropdownRef}
                    toggleState={setOpenDropdown}
                    open={openDropdown}
                  >
                    <div className="dropdown-c-content-base">
                      <div className="border-b-[1px] border-b-white my-2">
                        <h1 className="px-2 text-white font-semibold">
                          Remove
                        </h1>
                      </div>
                      <p className="note-text">
                        Are you sure you want to remove?
                      </p>
                      <InlineGroup className="justify-between p-2">
                        <button className="outline-btn">Remove</button>
                        <button className="cancel-btn">Close</button>
                      </InlineGroup>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="max-w-[150px] text-ellipsis relative overflow-hidden">
                <p className="max-w-[100%] overflow-hidden text-ellipsis text-gray-800 dark:text-gray-300"></p>
                <Paragraph>
                  {JSON.parse(buffer?.dataset?.props || "Spritesheet").name}
                </Paragraph>
              </div>
              <div className="preview-controller-label">
                <InlineGroup className="justify-between mt-2">
                  <InputGroup
                    label="FPS"
                    inputProps={{
                      value: fps,
                      onChange: () => {},
                    }}
                  />
                </InlineGroup>
                <InputRange value={fps} onChange={handleChangeFPS} />
              </div>
              <InlineGroup className="mt-2">
                <div className="flex-1">
                  <InputGroup
                    label="H"
                    inputProps={{
                      value: localProperties.height,
                      onKeyDownCapture: onEnterKeyboardEvent,
                      name: "height",
                      onChange: handleSpritesheetWHProperties,
                      type: "number",
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="W"
                    inputProps={{
                      onChange: handleSpritesheetWHProperties,
                      onKeyDownCapture: onEnterKeyboardEvent,
                      value: localProperties.width,
                      name: "width",
                      type: "number",
                    }}
                  />
                </div>
              </InlineGroup>
              <InlineGroup>
                <div className="flex-1">
                  <InputGroup
                    ref={frameXRenderRef}
                    label="X"
                    inputProps={{
                      onChange: (e) => {},
                      value: 0,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="Y"
                    inputProps={{
                      onChange: (e) => {},
                      value: JSON.parse(buffer?.dataset?.props || "0").posY,
                    }}
                  />
                </div>
              </InlineGroup>
              <InlineGroup className="justify-between items-center mt-2">
                <>
                  <div className="flex-1">
                    <button
                      className="-icon-button"
                      onClick={handleDownloadingSpriteSheet}
                    >
                      <FaDownload />
                    </button>
                  </div>
                  <div className="flex-1">
                    <button
                      ref={playStateRef}
                      className="-icon-button bg-secondaryBlue text-white"
                      onClick={handlePlayingState}
                    >
                      <IoPlayOutline />
                    </button>
                  </div>
                </>
              </InlineGroup>
            </div>
          </React.Fragment>
        </div>
      </>
    );
  }
);

export default React.memo(PreviewCard);
