import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
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
import RenderList from "../list/RenderList";
import { SidebarProps } from "../types";

const Sidebar: React.FC<SidebarProps> = ({ exportSpritesheet }) => {
  const { buffers, sidebarRef } = React.useContext(Context);
  const [sprites, setSprites] = React.useState<HTMLImageElement[]>([]);
  const [backgroundProps, setBackGroundProps] = React.useState({
    open: true,
    display: true,
    color: "#BFBFBF",
  });
  const deferredColorValue = React.useDeferredValue(backgroundProps.color);
  const [isPending, startTransition] = React.useTransition();
  const anim = new Animate();
  const renderer = new Renderer();

  const load = React.useCallback(async () => {
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
  }, [buffers]);

  React.useEffect(() => {
    load();
    return () => {
      //clean up
      setSprites([]);
    };
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

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs defaultTabIndex={1}>
        <Tab tabLabel="Preview">
          <div className="preview-base">
            <Accordion
              activeIcon={<AiOutlinePlus size={20} />}
              inactiveIcon={<AiOutlineMinus size={20} />}
              hidden
              open={backgroundProps.open}
              toogle={handleClickBgPropsOpen}
              title="PREVIEW BACKGROUND"
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
                    value={backgroundProps.color}
                  />
                  <p className="bg-text-color-label">{deferredColorValue}</p>
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
            {buffers.length <= 0 && (
              <div className="centered mt-1 flex flex-col">
                <img src={img} />
                <h4 className="text-lg text-blue-700">No Available Preview</h4>
                <p>Add some sprites in the canvas</p>
              </div>
            )}
            {buffers.length > 0 && (
              <React.Fragment>
                <div className="sidebar-anim-preview-base">
                  <p className="text-title px-5 py-3 ">ANIMATION PREVIEW</p>
                  <RenderList
                    sprites={sprites}
                    backgroundColor={deferredColorValue}
                    displayBackgroundColor={backgroundProps.display}
                    handlePlay={handlePlay}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
        </Tab>
        <Tab tabLabel="Configuration">
          <Configuration />
        </Tab>
        <Tab tabLabel="Export">
          <Export exportSpritesheet={exportSpritesheet} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Sidebar;
