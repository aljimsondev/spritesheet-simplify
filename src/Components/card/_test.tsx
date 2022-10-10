import React from "react";
import FormInput from "../form/FormInput";
import "./preview.css";
import { FaPlay, FaDownload, FaPause } from "react-icons/fa";
import { BufferDatasetProperties } from "./types";
import CreateAnimation from "../../renderer/CreateAnimation";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import Loader from "../Loader";
import Animate from "../../renderer/Animate";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const PreviewCard: React.FC<{
  buffer: HTMLImageElement | undefined;
  handleDownload: () => void;
  handlePlayState: (sprite: HTMLImageElement, ref: HTMLCanvasElement) => void;
  index: number;
}> = ({ buffer, handleDownload, handlePlayState, index }) => {
  const [readyState, setReadyState] = React.useState(true);
  const [play, playAnimation] = React.useState(false);
  const [fps, setFps] = React.useState<number>(60);
  const playStateRef = React.useRef<HTMLButtonElement>(null);
  const defaultScreen = { height: 120, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const frameXTextRef = React.useRef<HTMLParagraphElement>(null);

  const handlePlayingState = () => {
    if (buffer) {
      handlePlayState(buffer, canvasRef.current!);
    }
  };

  React.useEffect(() => {
    (() => {
      if (buffer) {
        // CreatePreviewThumbnail(buffer,{height:})
      }
    })();
  }, []);

  return (
    <div className="preview-card">
      {!readyState ? (
        <div className="preview-loading-base">
          <p>Loading Preview</p>
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <div
            ref={canvasWrapperRef}
            className="preview-canvas-base"
            id="prev-canvas-base"
          >
            <canvas
              ref={canvasRef}
              height={defaultScreen.height}
              width={defaultScreen.width}
            ></canvas>
          </div>
          <div className="preview-controller-base">
            <div className="form-inline">
              <input id="fpsRef" />
            </div>
            <div className="form-inline">
              <div className="flex-1">
                <p ref={frameXTextRef}></p>
              </div>
              <div className="flex-1">
                <p>y: 1</p>
              </div>
            </div>
            <div className="form-inline">
              <div className="flex-1">
                <button
                  type="button"
                  className="btn-preview default"
                  onClick={handleDownload}
                >
                  <FaDownload />
                </button>
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  ref={playStateRef}
                  className="btn-preview primary"
                  onClick={handlePlayingState}
                >
                  {play ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default React.memo(PreviewCard);
