import React from "react";
import { FaDownload } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import { AiOutlineEllipsis } from "react-icons/ai";
import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
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
}> = ({
  buffer,
  handleDownload,
  handlePlayState,
  backgroundColor,
  displayBackgroundColor,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [fps, setFps] = React.useState<number>(60);
  const playStateRef = React.useRef<HTMLButtonElement>(null);
  const defaultScreen = { height: 120, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
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

    return () => {};
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
  return (
    <>
      <div className="preview-card ">
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
                <InputGroup label="FPS" value={fps} />
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
                    onChange={(e) => {}}
                    label="H"
                    type="number"
                    width={60}
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    onChange={(e) => {}}
                    label="W"
                    type="number"
                    width={60}
                  />
                </div>
              </>
            </InlineGroup>
            <InlineGroup>
              <>
                <div className="flex-1">
                  <InputGroup onChange={(e) => {}} label="X" />
                </div>
                <div className="flex-1">
                  <InputGroup onChange={(e) => {}} label="Y" />
                </div>
              </>
            </InlineGroup>
            <InlineGroup className="justify-between items-center mt-2">
              <>
                <div className="flex-1">
                  <button className="-icon-button" onClick={handleDownload}>
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
