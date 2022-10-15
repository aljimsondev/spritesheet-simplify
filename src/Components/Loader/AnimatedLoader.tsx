import React from "react";

function AnimatedLoader() {
  return (
    <div className="flex-1 h-2 min-h-[8px] w-[100vw] absolute top-0 left-0 z-[19]">
      <div className="a-loader"></div>
    </div>
  );
}

export default AnimatedLoader;
