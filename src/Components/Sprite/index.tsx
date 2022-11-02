import React from "react";
import SpriteType from "../../renderer/Sprite";

const Sprite: React.FC<{
  sprite: SpriteType;
  onSpriteClick: (sprite: SpriteType) => void;
}> = ({ sprite, onSpriteClick }) => {
  return (
    <div
      onClick={() => onSpriteClick(sprite)}
      style={{
        position: "absolute",
        userSelect: "none",
        top: `${sprite.position.y}px`,
        left: `${sprite.position.x}px`,
        width: `${sprite.width}px`,
        height: `${sprite.height}px`,
        minWidth: `${sprite.width}px`,
        minHeight: `${sprite.height}px`,
        maxWidth: `${sprite.width}px`,
        maxHeight: `${sprite.height}px`,
      }}
    >
      <img src={sprite.imageSource} alt={sprite.name} />
    </div>
  );
};

export default Sprite;
