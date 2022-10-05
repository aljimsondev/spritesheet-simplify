import React from "react";
import { NODE } from "../types";
import { SpritesPreviewProps } from "./types";
import { AiOutlineClose } from "react-icons/ai";
import "./index.css";

//TODO handle preview of the sprites
const SpritesPreview: NODE<SpritesPreviewProps> = ({ toogleState, images }) => {
  React.useEffect(() => {
    return () => {
      //clean up
    };
  }, []);
  return (
    <React.Fragment>
      <div className="modal-header">
        <button
          className="close-button error -sm abs right centered m-0-1 "
          onClick={toogleState}
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className="modal-body">
        <div className="container"></div>
      </div>
    </React.Fragment>
  );
};

export default SpritesPreview;
