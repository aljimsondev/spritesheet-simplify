import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Export: React.FC = () => {
  const [openExporting, setOpenExporting] = React.useState(true);

  const handleToogleExporting = () => {
    setOpenExporting((prevState) => !prevState);
  };
  return (
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
  );
};

export default React.memo(Export);
