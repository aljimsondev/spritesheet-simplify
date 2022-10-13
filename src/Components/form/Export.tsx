import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Accordion from "../accordion";

const Export: React.FC = () => {
  const [openExporting, setOpenExporting] = React.useState(true);

  const handleToogleExporting = () => {
    setOpenExporting((prevState) => !prevState);
  };
  return (
    <Accordion
      activeIcon={<AiOutlinePlus size={20} />}
      inactiveIcon={<AiOutlineMinus size={20} />}
      hidden
      open={openExporting}
      title="BORDERLINE"
      toogle={handleToogleExporting}
    >
      <div className="flex-1 relative my-3">
        <button className="btn-export">Export Spritesheet</button>
      </div>
    </Accordion>
  );
};

export default React.memo(Export);
