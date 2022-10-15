import React from "react";
import { FaDownload } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import { AiOutlineEllipsis } from "react-icons/ai";
import { IoPlayOutline } from "react-icons/io5";
import InlineGroup from "../group/InlineGroup";
import DropdownMenu from "../dropdown/DropdownMenu";
import InputGroup from "../input/InputGroup";
import { SpriteSheetDownload } from "../../helpers/SpriteSheetDownloader";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const defaultProperty = {
  height: 0,
  width: 0,
  x: 0,
  y: 0,
  name: "",
};

const PreviewCard: React.FC<{
  buffer: HTMLImageElement | undefined;
  backgroundColor: string;
  displayBackgroundColor: boolean;
  handlePlayState: (
    sprite: HTMLImageElement,
    ref: HTMLCanvasElement,
    options?: { fps: number }
  ) => void;
}> = ({ buffer, handlePlayState, backgroundColor, displayBackgroundColor }) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [fps, setFps] = React.useState<number>(60);
  const playStateRef = React.useRef<HTMLButtonElement>(null);
  const defaultScreen = { height: 150, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const previewCardRef = React.useRef<HTMLDivElement>(null);
  const deferredBgColor = React.useDeferredValue(backgroundColor);
  const [properties, setProperties] = React.useState<{
    name: string;
    height: number;
    width: number;
    x: number;
    y: number;
  }>(defaultProperty);

  const handlePlayingState = () => {
    if (buffer) {
      handlePlayState(buffer, canvasRef.current!, { fps: fps });
    }
  };

  React.useEffect(() => {
    (() => {
      const ctx = canvasRef.current?.getContext("2d")!;
      if (buffer) {
        const props: { name: string; height: number; width: number } =
          JSON.parse(buffer.dataset.props!);

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
          ...properties,
          width: props.width,
          height: props.height,
          name: props.name,
        });
      }
    })();

    return () => {
      //clean up
      setProperties(defaultProperty);
    };
  }, [backgroundColor, displayBackgroundColor]);

  const handleChangeFPS = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const val = e.target.value as string;
      setFps(parseFloat(val));
    } catch (e) {
      console.warn(e);
    }
  };

  //TODO add preview loading in each element
  //TODO edit configutaion and finalize functionality

  const handleDownloadingSpriteSheet = () => {
    if (buffer) {
      SpriteSheetDownload(buffer, {
        fileName: properties.name,
        fileType: "png",
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
                  <div className="dropdown-c-content-base"></div>
                </DropdownMenu>
              </div>
            </div>
            <div className="max-w-[150px] text-ellipsis relative overflow-hidden">
              <p className="max-w-[100%] overflow-hidden text-ellipsis">
                {properties.name}
              </p>
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
              <input
                type="range"
                value={fps}
                min={1}
                max={100}
                onChange={handleChangeFPS}
              />
            </div>
            <InlineGroup className="mt-2">
              <>
                <div className="flex-1">
                  <InputGroup
                    label="H"
                    inputProps={{
                      width: 60,
                      value: properties.height,
                      onChange: (e) => {},
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="W"
                    width={60}
                    inputProps={{
                      onChange: (e) => {},
                      value: properties.width,
                    }}
                  />
                </div>
              </>
            </InlineGroup>
            <InlineGroup>
              <>
                <div className="flex-1">
                  <InputGroup
                    label="X"
                    inputProps={{
                      onChange: (e) => {},
                      value: properties.x,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    label="Y"
                    inputProps={{
                      onChange: (e) => {},
                      value: properties.y,
                    }}
                  />
                </div>
              </>
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
};

export default React.memo(PreviewCard);
