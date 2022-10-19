import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import { Context } from "../../Store/store";
import Animate from "../../renderer/Animate";

import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import Configuration from "../form/Configuration";
import Export from "../form/Export";
import Accordion from "../accordion";
import RenderList from "../list/PreviewRenderList";
import { SidebarProps } from "../types";
import ColorPickerInput from "../input/ColorPickerInput";
import NoPreviewCard from "../card/NoPreviewCard";

const Sidebar: React.FC<SidebarProps> = ({
  exportSpritesheet,
  spritesheets,
}) => {
  const { buffers, sidebarRef } = React.useContext(Context);
  const [backgroundProps, setBackGroundProps] = React.useState({
    open: true,
    display: true,
    color: "#BFBFBF",
  });
  const deferredColorValue = React.useDeferredValue(backgroundProps.color);
  const [isPending, startTransition] = React.useTransition();

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

  //! FIX ME
  //? create edit functionality

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
                <ColorPickerInput
                  onColorChange={handleChangeBgPropsColor}
                  colorValue={deferredColorValue}
                  inputProps={{
                    name: "color",
                    id: "bg-color-picker",
                  }}
                />
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
            {buffers.length <= 0 && <NoPreviewCard />}
            {buffers.length > 0 && (
              <React.Fragment>
                <div className="sidebar-anim-preview-base">
                  <p className="text-title px-5 py-3 ">ANIMATION PREVIEW</p>
                  <RenderList
                    sprites={spritesheets}
                    backgroundColor={deferredColorValue}
                    displayBackgroundColor={backgroundProps.display}
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
