import React from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineQuestion,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { Context } from "../../Store/store";
import Accordion from "../accordion";
import InputGroup from "../input/InputGroup";
import TextInput from "../input/TextInput";
import FormInput from "./FormInput";

const Configuration = () => {
  const [openBorderOpt, setBorderOpt] = React.useState(true);
  const [paddingOpen, setPaddingOpen] = React.useState(true);
  const { properties, onUpdateProperties } = React.useContext(Context);
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

  const handleOpenPaddingOption = () => {
    setPaddingOpen((prevState) => !prevState);
  };
  //TODO add canvas configuration
  /**
   * 1. background
   * 2. view canvas properties
   * 3. canvas clear
   */

  const updateProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: any = parseFloat(e.target.value);
    console.log(val);

    if (!isNaN(val)) {
      onUpdateProperties([e.target.name], val);
    }
  };

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
          <input
            type="checkbox"
            className="input-check mr-3"
            checked={properties.borderLine}
            onChange={(e) => onUpdateProperties("borderLine", e.target.checked)}
          />
          <label className="text-sm">Show borderline</label>
        </div>
        <div className="flex-1 flex flex-col mt-3">
          <div className="flex-1 my-2">
            <p className="text-xs font-semibold text-gray-700">BORDER WIDTH</p>
          </div>
          <TextInput type="number" placeholder="Border Width" />
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
      <Accordion
        activeIcon={<AiOutlinePlus size={20} />}
        inactiveIcon={<AiOutlineMinus size={20} />}
        hidden
        open={paddingOpen}
        title="PADDING"
        toogle={handleOpenPaddingOption}
      >
        <div className="flex-1">
          <InputGroup
            label="Spritesheet Padding"
            inputProps={{
              onChange: updateProperties,
              name: "padding",
              type: "number",
              value: properties.padding,
            }}
            width={100}
          />
        </div>
      </Accordion>
    </>
  );
};

export default Configuration;
