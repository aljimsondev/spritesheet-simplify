import "./fabComponent.css";
import { AiOutlineQuestion } from "react-icons/ai";
import { NODE } from "../types";
import { FabProps } from "./types";

const FabComponent: NODE<FabProps> = ({ onClick }) => {
  return (
    <div className="fab-custom-wrapper">
      <button className="fab-custom" id="open-menu-button" onClick={onClick}>
        <AiOutlineQuestion fontSize={20} />
      </button>
    </div>
  );
};

export default FabComponent;
