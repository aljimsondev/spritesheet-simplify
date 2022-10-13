import React from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineQuestion,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import Accordion from "../accordion";

const Configuration = () => {
  const [openBorderOpt, setBorderOpt] = React.useState(true);
  const [backgroundProps, setBackGroundProps] = React.useState<{
    open: boolean;
    display: boolean;
    color: string;
  }>({
    open: true,
    display: true,
    color: "#BFBFBF",
  });

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

  const handleToogleBorderOpt = () => {
    setBorderOpt((prevState) => !prevState);
  };

  //TODO add canvas configuration
  /**
   * 1. background
   * 2. view canvas properties
   * 3. canvas clear
   */

  return (
    <>
      <Accordion
        activeIcon={<AiOutlinePlus size={20} />}
        inactiveIcon={<AiOutlineMinus size={20} />}
        hidden
        open={openBorderOpt}
        title="BORDERLINE"
        toogle={handleToogleBorderOpt}
      >
        <figure className="note-base">
          <span className="note-icon">
            <AiOutlineQuestion />
          </span>
          <p className="note-text">
            Note: Turn this off when exporting the spritesheets.
          </p>
        </figure>
        <div className="flex-1 flex items-center">
          <input type="checkbox" className="input-check mr-3" />
          <label className="text-sm">Show borderline</label>
        </div>
      </Accordion>
      <Accordion
        activeIcon={<AiOutlinePlus size={20} />}
        inactiveIcon={<AiOutlineMinus size={20} />}
        hidden
        open={backgroundProps.open}
        title="BACKGROUND"
        toogle={handleClickBgPropsOpen}
      >
        <div className="bg-color-picker-base">
          <label htmlFor="bg-color-picker" className="bg-color-picker-wrapper">
            <input
              type="color"
              value={backgroundProps.color}
              onChange={handleChangeBgPropsColor}
              name="color"
              id="bg-color-picker"
            />
            <p className="bg-text-color-label">{backgroundProps.color}</p>
          </label>
          <button onClick={handleClickBgPropsDisplay} className="-icon-button">
            {backgroundProps.display ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible size={20} />
            )}
          </button>
        </div>
      </Accordion>
    </>
  );
};

export default Configuration;
