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
import ColorPickerInput from "../input/ColorPickerInput";
import InputGroup from "../input/InputGroup";
import TextInput from "../input/TextInput";

const Configuration = () => {
  const [openBorderOpt, setBorderOpt] = React.useState(true);
  const [paddingOpen, setPaddingOpen] = React.useState(true);
  const { properties, onUpdateProperties } = React.useContext(Context);
  const [isPending, startTranstition] = React.useTransition();
  const [localState, setLocalState] = React.useState({
    borderColor: "#f3f3f3",
    canvasBackground: "#000000",
    borderWidth: 1,
    borderLine: false,
    padding: 0,
  });
  const [backgroundProps, setBackGroundProps] = React.useState<{
    open: boolean;
    display: boolean;
  }>({
    open: true,
    display: true,
  });

  const handleClickBgPropsOpen = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setBackGroundProps({ ...backgroundProps, open: !backgroundProps.open });
  };

  const memoizedLocalState = React.useMemo(() => {
    return localState;
  }, [localState]);

  const memoizedColorPickerInputProps = React.useMemo(() => {
    return {
      borderColor: {
        name: "borderColor",
        id: "border-color-picker",
      },
      canvasBackground: {
        name: "canvasBackground",
        id: "canvas-bg-color-picker",
      },
    };
  }, []);
  const memoizedIcons = React.useMemo(() => {
    return {
      activeIcon: <AiOutlinePlus size={20} />,
      inActiveIcon: <AiOutlineMinus size={20} />,
      question: <AiOutlineQuestion />,
      eyeShow: <AiOutlineEye size={20} />,
      eyeHidden: <AiOutlineEyeInvisible size={20} />,
    };
  }, []);

  const handleClickBgPropsDisplay = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setBackGroundProps({
        ...backgroundProps,
        display: !backgroundProps.display,
      });
      startTranstition(() => {
        onUpdateProperties("displayCanvasBackground", !backgroundProps.display);
      });
    },
    [backgroundProps.display]
  );

  const handleToogleBorderOpt = React.useCallback(() => {
    setBorderOpt((prevState) => !prevState);
  }, [openBorderOpt]);

  const handleOpenPaddingOption = React.useCallback(() => {
    setPaddingOpen((prevState) => !prevState);
  }, [paddingOpen]);

  const updateProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val: any = parseFloat(e.target.value);

    if (!isNaN(val) && e.target.type === "number") {
      onUpdateProperties([e.target.name] as any, val);
    } else {
      onUpdateProperties([e.target.name] as any, e.target.value);
    }
  };

  React.useEffect(() => {
    (() => {
      setBackGroundProps({
        ...backgroundProps,
        display: properties.displayCanvasBackground,
      });
      setLocalState({
        ...localState,
        borderLine: properties.borderLine,
        borderColor: properties.borderColor,
        borderWidth: properties.borderWidth,
        padding: properties.padding,
        canvasBackground: properties.canvasBackground,
      });
    })();
  }, []);

  const handleChangeState = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalState({ ...localState, [e.target.name]: e.target.value });
      startTranstition(() => {
        updateProperties(e);
      });
    },
    [
      localState.borderColor,
      localState.borderLine,
      localState.canvasBackground,
      localState.padding,
      localState.borderWidth,
    ]
  );

  return (
    <>
      <Accordion
        activeIcon={memoizedIcons.activeIcon}
        inactiveIcon={memoizedIcons.inActiveIcon}
        hidden
        open={openBorderOpt}
        title="BORDERLINE"
        toogle={handleToogleBorderOpt}
      >
        <figure className="note-base">
          <span className="note-icon">{memoizedIcons.question}</span>
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
          <label className="text-sm text-gray-800 dark:text-gray-300">
            Show borderline
          </label>
        </div>
        <div className="flex-1 flex flex-col mt-3">
          <div className="flex-1 my-2">
            <p className="text-title">BORDER WIDTH</p>
          </div>
          <TextInput
            type="number"
            name="borderWidth"
            placeholder="Border Width"
            value={memoizedLocalState.borderWidth}
            onChange={handleChangeState}
            min={1}
          />
        </div>
        <div className="flex-1 flex flex-col mt-3">
          <div className="flex-1 my-2">
            <p className="text-title">BORDER COLOR</p>
          </div>
          <ColorPickerInput
            colorValue={memoizedLocalState.borderColor}
            onColorChange={handleChangeState}
            inputProps={memoizedColorPickerInputProps.borderColor}
          />
        </div>
      </Accordion>
      <Accordion
        activeIcon={memoizedIcons.activeIcon}
        inactiveIcon={memoizedIcons.inActiveIcon}
        hidden
        open={backgroundProps.open}
        title="BACKGROUND"
        toogle={handleClickBgPropsOpen}
      >
        <div className="bg-color-picker-base">
          <ColorPickerInput
            colorValue={memoizedLocalState.canvasBackground}
            onColorChange={handleChangeState}
            inputProps={memoizedColorPickerInputProps.canvasBackground}
          />
          <button onClick={handleClickBgPropsDisplay} className="-icon-button">
            {backgroundProps.display
              ? memoizedIcons.eyeShow
              : memoizedIcons.eyeHidden}
          </button>
        </div>
      </Accordion>
      <Accordion
        activeIcon={memoizedIcons.activeIcon}
        inactiveIcon={memoizedIcons.inActiveIcon}
        hidden
        open={paddingOpen}
        title="SPRITESHEET PADDING"
        toogle={handleOpenPaddingOption}
      >
        <div className="flex-1 mt-2">
          <TextInput
            onChange={handleChangeState}
            name="padding"
            type="number"
            value={memoizedLocalState.padding}
            min={0}
          />
        </div>
        <figure className="note-base my-3">
          <span className="note-icon">{memoizedIcons.question}</span>
          <p className="note-text">
            Note: Padding will be applied when there is more than 1 column.
          </p>
        </figure>
      </Accordion>
    </>
  );
};

export default Configuration;
