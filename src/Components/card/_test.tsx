import React from "react";
import "./preview.css";
import { FaPlay, FaDownload, FaPause } from "react-icons/fa";
import CreatePreviewThumbnail from "../../renderer/CreatePreviewThumbnail";
import Loader from "../Loader";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const PreviewCard: React.FC<{
  buffer: HTMLImageElement | undefined;
  handleDownload: () => void;
  handlePlayState: (
    sprite: HTMLImageElement,
    ref: HTMLCanvasElement,
    options?: { fps: number }
  ) => void;
  index: number;
}> = ({ buffer, handleDownload, handlePlayState, index }) => {
  const [readyState, setReadyState] = React.useState(false);
  const [play, playAnimation] = React.useState(false);
  const [fps, setFps] = React.useState<number>(5);
  const playStateRef = React.useRef<HTMLButtonElement>(null);
  const defaultScreen = { height: 120, width: 120 };
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const frameXTextRef = React.useRef<HTMLParagraphElement>(null);

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

    const timer = setTimeout(() => {
      setReadyState(true);
    }, 1000);

    return () => {
      setReadyState(false);
      clearTimeout(timer);
    };
  }, []);

  const handleChangeFPS = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const val = e.target.value as string;
      setFps(parseFloat(val));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="preview-card">
      {!readyState && (
        <div className="preview-loading-base">
          <p>Loading Preview</p>
          <Loader />
        </div>
      )}

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
            id="preview-canvas"
          ></canvas>
        </div>
        <div className="preview-controller-base">
          <div className="form-inline">
            <div className="fps-input-base">
              <label>FPS:</label>
              <p>{fps}</p>
            </div>
            <input
              type="range"
              value={fps}
              min={1}
              max={100}
              onChange={handleChangeFPS}
            />
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
    </div>
  );
};

export default React.memo(PreviewCard);
