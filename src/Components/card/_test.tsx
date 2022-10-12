import React from "react";
import { FaPlay, FaDownload, FaPause, FaEllipsisH } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import { AiOutlineEllipsis } from "react-icons/ai";
import InlineGroup from "../group/InlineGroup";
import DropdownMenu from "../dropdown/DropdownMenu";
import InputGroup from "../input/InputGroup";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const PreviewCard: React.FC<{
  buffer: HTMLImageElement | undefined;
  backgroundColor: string;
  displayBackgroundColor: boolean;
  handleDownload: () => void;
  handlePlayState: (
    sprite: HTMLImageElement,
    ref: HTMLCanvasElement,
    options?: { fps: number }
  ) => void;
  index: number;
}> = ({
  buffer,
  handleDownload,
  handlePlayState,
  index,
  backgroundColor,
  displayBackgroundColor,
}) => {
  const [readyState, setReadyState] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [play, playAnimation] = React.useState(false);
  const [fps, setFps] = React.useState<number>(60);
  const playStateRef = React.useRef<HTMLButtonElement>(null);
  const defaultScreen = { height: 120, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const frameXTextRef = React.useRef<HTMLParagraphElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
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
      }
    })();

    // const timer = setTimeout(() => {
    //   setReadyState(true);
    // }, 100);

    return () => {
      setReadyState(false);
      // clearTimeout(timer);
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
  const handleDropdown = () => {
    setOpenDropdown((prevState) => !prevState);
  };

  //TODO add preview loading in each element
  return (
    <>
      <div className="preview-card ">
        {/* {!readyState && (
          <div className="preview-loading-base">
            <p>Loading Preview</p>
            <Loader />
          </div>
        )} */}
        <React.Fragment>
          <div ref={canvasWrapperRef} className="preview-canvas-base">
            <div
              className="preview-canvas"
              style={{
                background: displayBackgroundColor ? backgroundColor : "none",
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
            <p>Spritesheet01_attack</p>
            <div className="preview-controller-label">
              <InlineGroup className="justify-between mt-2">
                <>
                  <label>FPS:</label>
                  <p>{fps}</p>
                </>
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
                  <InputGroup id="h-input" onChange={(e) => {}} label="H" />
                </div>
                <div className="flex-1">
                  <InputGroup id="w-input" onChange={(e) => {}} label="W" />
                </div>
              </>
            </InlineGroup>
            <InlineGroup>
              <>
                <div className="flex-1">
                  <InputGroup id="h-input" onChange={(e) => {}} label="X" />
                </div>
                <div className="flex-1">
                  <InputGroup id="h-input" onChange={(e) => {}} label="Y" />
                </div>
              </>
            </InlineGroup>
            <InlineGroup className="justify-between items-center mt-2">
              <>
                <button className="-icon-button" onClick={handleDownload}>
                  <FaDownload />
                </button>
                <button
                  ref={playStateRef}
                  className="-icon-button"
                  onClick={handlePlayingState}
                >
                  {play ? <FaPause /> : <FaPlay />}
                </button>
              </>
            </InlineGroup>
          </div>
        </React.Fragment>
      </div>
    </>
  );
};

export default React.memo(PreviewCard);
