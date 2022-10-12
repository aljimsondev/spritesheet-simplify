import React from "react";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineQuestion,
} from "react-icons/ai";

const Configuration = () => {
  const [openBorderOpt, setBorderOpt] = React.useState(true);
  const [openExporting, setOpenExporting] = React.useState(true);

  const handleToogleBorderOpt = () => {
    setBorderOpt((prevState) => !prevState);
  };

  const handleToogleExporting = () => {
    setOpenExporting((prevState) => !prevState);
  };

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
          <p className="text-title">EXPORT</p>
          <button onClick={handleToogleExporting} className="-icon-button">
            {openExporting ? (
              <AiOutlineMinus size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </button>
        </div>
        <details open={openExporting}>
          <summary className="hidden"></summary>
          <div className="flex-1 relative my-3">
            <button className="btn-export">Export Spritesheet</button>
          </div>
        </details>
      </div>
    </>
  );
};

export default Configuration;
