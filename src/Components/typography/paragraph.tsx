import React from "react";

const Paragraph: React.FC<{ children: any }> = ({ children }) => {
  return (
    <p className="max-w-[100%] overflow-hidden text-ellipsis text-gray-800 dark:text-gray-300">
      {children}
    </p>
  );
};

export default React.memo(Paragraph);
