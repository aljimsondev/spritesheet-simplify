import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import PreviewCard from "../card/PreviewCard";
import { Context } from "../../Store/store";
import Renderer from "../../renderer";
import Animate from "../../renderer/Animate.test";
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
  const [backgroundProps, setBackGroundProps] = React.useState<{
    open: boolean;
    display: boolean;
    color: string;
  }>({
    open: true,
    display: true,
    color: "#BFBFBF",
  });
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

  const handleChangeBgPropsColor = (e: any) => {
    setBackGroundProps({ ...backgroundProps, [e.target.name]: e.target.value });
  };
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

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs defaultTabIndex={1}>
        <Tab tabLabel="Preview">
          <div className="preview-base">
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
                        value={backgroundProps.color}
                        onChange={handleChangeBgPropsColor}
                        name="color"
                        id="bg-color-picker"
                      />
                      <p className="bg-text-color-label">
                        {backgroundProps.color}
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
                        backgroundColor={backgroundProps.color}
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
