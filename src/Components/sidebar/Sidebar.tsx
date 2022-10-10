import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import NavMenuForm from "../form/NavMenuForm";
import "./sidebar.css";
import PreviewCard from "../card/_test";
import { Context } from "../../Store/store";
import Renderer from "../../renderer";
import Animate from "../../renderer/Animate.test";
import img from "../../assets/images-removebg-preview.png";

const Sidebar: React.FC<{}> = () => {
  const { buffers, sidebarRef } = React.useContext(Context);
  const [sprites, setSprites] = React.useState<HTMLImageElement[]>([]);
  const anim = new Animate();
  // anim.canvasProperties = { height: 120, width: 120 };
  //! FIX ME - animation rendering class
  //? fix ui e.g. preview card
  //? optimize performance
  //TODO add panning in the canvas
  //! NOTICE FIX CUSTOM SIZE AND ADD CONFIGURATION
  //?

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

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs>
        <Tab tabLabel="Preview">
          <div className="preview-base">
            {buffers.length <= 0 ? (
              <div className="centered mt-1 flex flex-col">
                <img src={img} />
                <h4>No Available Preview</h4>
                <p>Add some sprites in the canvas</p>
              </div>
            ) : (
              sprites.map((spritesheet, index) => {
                return (
                  <PreviewCard
                    key={`${spritesheet.dataset.props! + index}`}
                    index={index}
                    buffer={spritesheet}
                    handleDownload={() => {}}
                    handlePlayState={handlePlay}
                  />
                );
              })
            )}
          </div>
        </Tab>
        <Tab tabLabel="Configuration">
          <div className="form-base">
            <NavMenuForm />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default React.memo(Sidebar);
