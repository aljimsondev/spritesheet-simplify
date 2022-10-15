import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import PreviewCard from "../card/PreviewCard";
import { Context } from "../../Store/store";
import Renderer from "../../renderer";
import Animate from "../../renderer/Animate";
import img from "../../assets/images-removebg-preview.png";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import Configuration from "../form/Configuration";
import Export from "../form/Export";
import Accordion from "../accordion";

const Sidebar: React.FC<{}> = () => {
  const { buffers, sidebarRef } = React.useContext(Context);
  const [sprites, setSprites] = React.useState<HTMLImageElement[]>([]);
  const [backgroundProps, setBackGroundProps] = React.useState({
    open: true,
    display: true,
    color: "#BFBFBF",
  });
  const deferredColorValue = React.useDeferredValue(backgroundProps.color);
  const bgColorRef = React.useRef<HTMLInputElement>(null);
  const previewBaseRef = React.useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = React.useTransition();
  const anim = new Animate();

  React.useEffect(() => {
    (async () => {
      //create spritesheets here
      const renderer = new Renderer();
      renderer.loadBuffers(buffers).then((d) => {
        renderer.createSpritesheets().then(async (spritesData) => {
          if (spritesData.length > 0) {
            await anim.loadSpritesheets(spritesData).then((isloaded) => {
              if (isloaded) {
                setSprites(spritesData); //set sprites after it was loaded in the animation engine
              }
            });
          }
        });
      });
    })();
  }, [buffers]);

  const handlePlay = async (
    sprite: HTMLImageElement,
    ref: HTMLCanvasElement,
    options?: { fps: number }
  ) => {
    anim.init(ref); //set reference to the target canvas
    anim.play(sprite, {
      fps: options?.fps,
    });
  };

  const handleChangeBgPropsColor = React.useCallback(
    (e: any) => {
      startTransition(() => {
        setBackGroundProps({
          ...backgroundProps,
          [e.target.name]: e.target.value,
        });
      });
    },
    [deferredColorValue]
  );
  const handleClickBgPropsOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setBackGroundProps({ ...backgroundProps, open: !backgroundProps.open });
  };
  const handleClickBgPropsDisplay = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setBackGroundProps({
      ...backgroundProps,
      display: !backgroundProps.display,
    });
  };
  //TODO FINALIZE EXPORT
  //TODO FINALIZE PREVIEW

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs defaultTabIndex={1}>
        <Tab tabLabel="Preview">
          <div className="preview-base" ref={previewBaseRef}>
            {buffers.length <= 0 && (
              <div className="centered mt-1 flex flex-col">
                <img src={img} />
                <h4>No Available Preview</h4>
                <p>Add some sprites in the canvas</p>
              </div>
            )}
            {buffers.length > 0 && (
              <React.Fragment>
                <Accordion
                  activeIcon={<AiOutlinePlus size={20} />}
                  inactiveIcon={<AiOutlineMinus size={20} />}
                  hidden
                  open={backgroundProps.open}
                  toogle={handleClickBgPropsOpen}
                  title="BACKGROUND"
                >
                  <div className="bg-color-picker-base">
                    <label
                      htmlFor="bg-color-picker"
                      className="bg-color-picker-wrapper"
                    >
                      <input
                        type="color"
                        onChange={handleChangeBgPropsColor}
                        name="color"
                        id="bg-color-picker"
                        ref={bgColorRef}
                      />
                      <p className="bg-text-color-label">
                        {deferredColorValue}
                      </p>
                    </label>
                    <button
                      onClick={handleClickBgPropsDisplay}
                      className="-icon-button"
                    >
                      {backgroundProps.display ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </Accordion>
                <div className="sidebar-anim-preview-base">
                  <p className="text-title px-5 py-3 ">ANIMATION PREVIEW</p>
                  {sprites.map((spritesheet, index) => {
                    return (
                      <PreviewCard
                        key={`${spritesheet.dataset.props! + index}`}
                        backgroundColor={deferredColorValue}
                        displayBackgroundColor={backgroundProps.display}
                        buffer={spritesheet}
                        handleDownload={() => {}}
                        handlePlayState={handlePlay}
                      />
                    );
                  })}
                </div>
              </React.Fragment>
            )}
          </div>
        </Tab>
        <Tab tabLabel="Configuration">
          <Configuration />
        </Tab>
        <Tab tabLabel="Export">
          <Export />
        </Tab>
      </Tabs>
    </div>
  );
};

export default React.memo(Sidebar);
