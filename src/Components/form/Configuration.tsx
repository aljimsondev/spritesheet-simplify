import React from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineQuestion,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

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
      <div className="configuration-base outline-b">
        <div className="flex-1 flex items-center justify-between">
          <p className="text-title">BORDERLINE</p>
          <button onClick={handleToogleBorderOpt} className="-icon-button">
            {openBorderOpt ? (
              <AiOutlineMinus size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </button>
        </div>
        <details open={openBorderOpt}>
          <summary className="hidden"></summary>
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
        </details>
      </div>
      <div className="configuration-base outline-b">
        <div className="flex-1 flex items-center justify-between">
          <p className="text-title">BACKGROUND</p>
          <button onClick={handleClickBgPropsOpen} className="-icon-button">
            {backgroundProps.open ? (
              <AiOutlineMinus size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </button>
        </div>
        <details open={backgroundProps.open}>
          <summary className="hidden"></summary>
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
              <p className="bg-text-color-label">{backgroundProps.color}</p>
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
        </details>
      </div>
    </>
  );
};

export default Configuration;
