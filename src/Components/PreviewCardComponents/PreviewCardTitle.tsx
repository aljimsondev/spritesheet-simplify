import React from "react";
import Paragraph from "../typography/paragraph";

const PreviewCardTitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="max-w-[150px] text-ellipsis relative overflow-hidden">
      <p className="max-w-[100%] overflow-hidden text-ellipsis text-gray-800 dark:text-gray-300"></p>
      <Paragraph>{text}</Paragraph>
    </div>
  );
};

export default PreviewCardTitle;
