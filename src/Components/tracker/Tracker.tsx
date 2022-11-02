import React from "react";
import Sprite from "../../renderer/Sprite";

const Tracker: React.FC<{ sprite?: Sprite }> = ({ sprite }) => {
  function render() {
    if (sprite) {
      return (
        <div
          style={{
            top: sprite.position.y,
            left: sprite.position.x,
            height: sprite.height,
            width: sprite.width,
          }}
          className="sprite-tracker"
        ></div>
      );
    }
    return <React.Fragment></React.Fragment>;
  }
  return render();
};

export default React.memo(Tracker);
