import React from "react";
import InlineGroup from "../group/InlineGroup";
import DropdownMenu from "./DropdownMenu";
import { AiOutlineEllipsis } from "react-icons/ai";
import { HandleRemoveColumnType } from "../../types/types";

const PreviewCardDropdown: React.FC<{
  handleRemoveColumn: HandleRemoveColumnType;
  sourceIndex: number;
}> = ({ handleRemoveColumn, sourceIndex }) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = React.useState(false);

  const toogleClose = () => {
    setOpenDropdown(false);
  };

  const handleRemove = async () => {
    await handleRemoveColumn(sourceIndex);
  };
  return (
    <div className="relative flex-grow flex items-center justify-end">
      <div ref={dropdownRef}>
        <DropdownMenu
          icon={<AiOutlineEllipsis size={25} />}
          buttonClass="-icon-button"
          dropdownRef={dropdownRef}
          toggleState={setOpenDropdown}
          open={openDropdown}
        >
          <div className="dropdown-c-content-base">
            <div>
              <p>Edit Pivot </p>
            </div>
            <div>
              <p>Remove</p>
            </div>
          </div>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default React.memo(PreviewCardDropdown);

const RemoveColumnCard: React.FC<{
  handleRemove: () => void;
  toogleClose: () => void;
}> = ({ handleRemove, toogleClose }) => {
  return (
    <>
      <div className="border-b-[1px] border-b-white my-2">
        <h1 className="px-2 text-white font-semibold">Remove</h1>
      </div>
      <p className="note-text">Are you sure you want to remove?</p>
      <InlineGroup className="justify-between p-2">
        <button className="outline-btn" onClick={handleRemove}>
          Remove
        </button>
        <button className="cancel-btn" onClick={toogleClose}>
          Close
        </button>
      </InlineGroup>
    </>
  );
};
