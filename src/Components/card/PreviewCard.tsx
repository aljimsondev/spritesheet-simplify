import React from "react";
import FormInput from "../form/FormInput";
import "./preview.css";
import { FaPlay, FaDownload, FaPause } from "react-icons/fa";
import { BufferDatasetProperties } from "./types";
import CreateAnimation from "../AnimationEngine/CreateAnimation";
import CreatePreviewThumbnail from "../AnimationEngine/CreatePreviewThumbnail";
import Loader from "../Loader";

//config must be global to allow configuration for the user whatever they desired
const config = {
  animationFrameOffset: 0, //offset in animation frame rendering
};

const PreviewCard: React.FC<{
  buffer: HTMLImageElement | undefined;
}> = ({ buffer }) => {
  const [readyState, setReadyState] = React.useState(false);
  const [play, playAnimation] = React.useState(false);
  const playing = React.useRef<boolean>(false);
  const [fps, setFps] = React.useState<number>(60);
  let RAF = React.useRef<number>(0);
  const defaultScreen = { height: 120, width: 120 };
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const frameXTextRef = React.useRef<HTMLParagraphElement>(null);
  const maxFrame = React.useRef<number>(0);
  const frame = React.useRef<number>(0);
  let interval = 1000 / fps;
  let timer = 0;
  let lastTime = 0;

  //should run in first render
  React.useEffect(() => {
    setTimeout(() => {
      if (buffer) {
        setReadyState(true);
      }
    }, 2000);
    return () => {
      //clean up
      setReadyState(false);
    };
  }, []);

  React.useEffect(() => {
    try {
      const ctx = canvasRef.current?.getContext("2d");
      if (buffer && ctx) {
        const stringProps: string = buffer.dataset.props || "{}";
        const bufferProperties: BufferDatasetProperties =
          JSON.parse(stringProps);
        maxFrame.current = buffer.width / bufferProperties.width - 1; //getting the maxframe
        //create thumbnail if preview is not yet played
        if (!playing.current) {
          CreatePreviewThumbnail(
            buffer,
            bufferProperties,
            ctx,
            defaultScreen.width,
            defaultScreen.height
          );
          if (frameXTextRef.current) {
            frameXTextRef.current.textContent = `X: ${frame.current}`;
          }
        }

        //animation logic

        const animate = (time: number) => {
          const deltatime = time - lastTime;
          lastTime = time;
          ctx.clearRect(0, 0, defaultScreen.width, defaultScreen.height);

          if (buffer?.src === "data:,") return; //broken state cant proceed to  animation

          //handle animation here
          if (play) {
            playing.current = true; //set as the thumbnail observer when false renders the thumbnail
            if (
              frame.current >
              maxFrame.current + config.animationFrameOffset
            ) {
              //to avoid flickering of the animation, current frame must not be allowed to increment higher than the maxframe set `>=` as statement above
              frame.current = 0; //reset current frame
              playAnimation(false);
            } else {
              if (timer > interval) {
                frame.current++; //increment frame
                timer = 0; //reset timer
              } else {
                timer += deltatime;
              }
            }
          }
          //playing the animation
          CreateAnimation(
            buffer,
            bufferProperties,
            ctx,
            frame.current,
            0,
            defaultScreen.width,
            defaultScreen.height
          );
          if (frameXTextRef.current) {
            frameXTextRef.current.textContent = `X: ${frame.current}`;
          }

          RAF.current = requestAnimationFrame(animate);
        };
        //runs animation when play state is true
        if (play) {
          animate(0);
        }
      }
    } catch (e) {
      console.warn(e);
    }

    return () => {
      //clean up;
      cancelAnimationFrame(RAF.current);
    };
  }, [fps, play, readyState]);

  const handleChangeFps = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value: number = parseFloat(e.target.value);
      setFps(value);
    } catch (e) {
      //error handle goes here
      console.warn(e);
    }
  };

  const handlePlayState = () => {
    playAnimation((prevState) => !prevState);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    const bufferProps: BufferDatasetProperties = JSON.parse(
      buffer?.dataset.props || "{}"
    );
    a.href = buffer!.src;
    a.download = bufferProps.name || "spritesheet.png";
    a.click();
  };

  return (
    <div className="preview-card">
      {!readyState ? (
        <div className="preview-loading-base">
          <p>Loading Preview</p>
          <Loader />
        </div>
      ) : (
        <React.Fragment>
          <div className="preview-canvas-base">
            <canvas
              ref={canvasRef}
              id="preview-canvas"
              width={defaultScreen.width}
              height={defaultScreen.height}
            ></canvas>
          </div>
          <div className="preview-controller-base">
            <div className="form-inline">
              <FormInput
                label="FPS"
                value={fps}
                type="number"
                onValueChange={handleChangeFps}
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
                  className="btn-preview primary"
                  onClick={handlePlayState}
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
