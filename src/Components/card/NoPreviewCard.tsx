import React from "react";
import img from "../../assets/images-removebg-preview.png";

function NoPreviewCard() {
  return (
    <div className="centered mt-1 flex flex-col">
      <img src={img} />
      <h4 className="text-lg text-blue-700">No Available Preview</h4>
      <p className="text-gray-800 dark:text-gray-300">
        Add some sprites in the canvas
      </p>
    </div>
  );
}

export default React.memo(NoPreviewCard);
