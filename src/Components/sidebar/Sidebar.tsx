import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import NavMenuForm from "../form/NavMenuForm";
import "./sidebar.css";
import PreviewCard from "../card/PreviewCard";
import { Context } from "../../Store/store";
import Renderer from "../../renderer";

const Sidebar: React.FC<{}> = () => {
  const { buffers, sidebarRef } = React.useContext(Context);
  const [sprites, setSprites] = React.useState<HTMLImageElement[]>([]);

  React.useEffect(() => {
    (async () => {
      //create spritesheets here
      const renderer = new Renderer();
      renderer.loadBuffers(buffers).then((d) => {
        renderer.createSpritesheets().then((spritesData) => {
          if (spritesData.length > 0) {
            setSprites(spritesData);
          }
        });
      });
    })();
  }, [buffers]);

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs>
        <Tab tabLabel="Preview">
          <div className="preview-base">
            {buffers.length <= 0 ? (
              <div className="centered mt-1 flex flex-col">
                <h4>No Available Preview</h4>
                <p>Add some sprites in the canvas</p>
              </div>
            ) : (
              sprites.map((spritesheet, index) => {
                return (
                  <PreviewCard
                    key={spritesheet.dataset.props}
                    buffer={spritesheet}
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
