import React from "react";
import FabComponent from "../Components/button/FabComponent";
import Sidebar from "../Components/sidebar/Sidebar";
import Modal from "../Components/modal";
import ModalContent from "../Components/modal/ModalContent";
import Notification from "../Components/notification/Notification";
import { Context } from "../Store/store";
import {
  fetchToLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "../helpers/LocalStorageHelper";
import LoadBase64Images from "../helpers/LoadBase64Files";
import Renderer from "../renderer/core/Renderer";
import { disableZoom } from "../EventHandler/DisableZoom";
import { useDeferredObject } from "../helpers/UseDeferredObject";
import AnimatedLoader from "../Components/Loader/AnimatedLoader";
import { CanvasZoomDrag } from "../EventHandler/CanvasZoomDrag";
import NavbarMain from "../Components/navbar";
import SpriteType from "../renderer/Sprite";
import Tracker from "../Components/tracker/Tracker";
import { render } from "react-dom";
import Sprite from "../Components/Sprite";

/**
 * add pivot functionality
 * get every sprites properties in JSON
 * add crop/trimmed
 * add dropdown pivot properties
 */
type DisplayMode = "horizontal" | "vertical" | "compact" | "animation";

const RenderSprite: React.FC<{
  sprites: any[];
  onSpriteClick: (sprite: SpriteType) => void;
}> = ({ sprites, onSpriteClick }) => {
  return (
    <>
      {sprites.map((sprite, index) => {
        return (
          <Sprite
            key={`${sprite.name + index}`}
            sprite={sprite}
            onSpriteClick={onSpriteClick}
          />
        );
      })}
    </>
  );
};

function App() {
  const {
    properties,
    notification,
    notificationDispatch,
    reloadApp,
    buffers,
    setBuffers,
  } = React.useContext(Context);

  const refs = {
    fileInput: React.useRef<HTMLInputElement>(null),
    downloadButton: React.useRef<HTMLAnchorElement>(null),
    canvasWrapper: React.useRef(null),
  };
  const [loading, setLoading] = React.useState(true);
  const [sprites, setSprites] = React.useState<any[]>([]);
  const [activeSprite, setActiveSprite] = React.useState<
    SpriteType | undefined
  >(undefined);

  const [displayMode, setDisplayMode] =
    React.useState<DisplayMode>("animation");
  const renderer = new Renderer();
  const [baseProps, setBaseProps] = React.useState({
    height: 0,
    width: 0,
  });

  //handle image selection
  const handleSelectImages = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files!;
      const data = await LoadBase64Images(files);
      setBuffers([...buffers, data]);
      saveToLocalStorage("blobs", [...buffers, data]);
    },
    [buffers]
  );

  const handleToogleDisplayMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayMode(e.target.value as DisplayMode);
    setActiveSprite(undefined);
  };

  //runs in first render and reload
  React.useEffect(() => {
    //disable zoom in root element
    disableZoom(document.getElementById("root")!);
    //set draggable element
    //enable zoom drag
    CanvasZoomDrag(refs.canvasWrapper.current!, {
      resetParentEl: document.getElementById("canvas-wrapper")!,
    });
    //fetch blobs to localstorage
    const localBlobs = fetchToLocalStorage("blobs");
    if (localBlobs) {
      setBuffers(localBlobs);
    }
    const timer = setTimeout(() => {
      if (!reloadApp) {
        setLoading(false);
      }
    }, Math.random() * 2000);

    return () => {
      setBuffers([]); //clean up
      setLoading(true);
      clearTimeout(timer);
    };
  }, [reloadApp]);

  //renderer initialization
  React.useEffect(() => {
    (async () => {
      await renderer.loadBuffers(buffers).then((data) => {
        if (!data) return;
        switch (displayMode) {
          case "compact":
            const compact = renderer.loadSpriteInCompactView();
            setSprites(compact.sprites.flat());
            setBaseProps({
              ...baseProps,
              height: compact.height,
              width: compact.width,
            });
            break;
          case "animation":
            const anim = renderer.loadSpriteAnimView();
            // setCompactSprites(anim.sprites);
            setSprites(anim.sprites.flat());
            setBaseProps({
              ...baseProps,
              height: anim.height,
              width: anim.width,
            });
            break;
          case "horizontal":
            const horizontal = renderer.loadSpritesHorizontal();
            setSprites(horizontal.sprites);
            setBaseProps({
              ...baseProps,
              height: horizontal.height,
              width: horizontal.width,
            });
            break;
          case "vertical":
            const vertical = renderer.loadSpritesVertical();
            setSprites(vertical.sprites);
            setBaseProps({
              ...baseProps,
              height: vertical.height,
              width: vertical.width,
            });
            break;
        }
      });
    })();
    return () => {
      //clean up function
      document.getElementById("renderer-canvas")?.remove(); //remove the canvas on rerender
    };
  }, [
    buffers, //whenever new buffer added
    loading, //whenever is reload activated
    activeSprite,
    displayMode,
  ]);

  const onSpriteClickHandler = (sprite: SpriteType) => {
    setActiveSprite(sprite);
  };

  return (
    <>
      <div className="main-container">
        <div className="container-grow">
          {loading && <AnimatedLoader />}
          <div>
            <select
              value={displayMode}
              name="displayMode"
              onChange={handleToogleDisplayMode}
            >
              <option value="animation">Animation</option>
              <option value="compact">Compact</option>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
          <div id="canvas-wrapper" className="canvas-wrapper">
            <div
              ref={refs.canvasWrapper}
              id="canvas-root"
              style={{
                position: "relative",
                background: properties.displayCanvasBackground
                  ? properties.canvasBackground
                  : "transparent",
                height: baseProps.height,
                width: baseProps.width,
              }}
            >
              <RenderSprite
                sprites={sprites}
                onSpriteClick={onSpriteClickHandler}
              />
              <Tracker sprite={activeSprite} />
            </div>
          </div>
          <form>
            <input
              id="upload"
              type="file"
              accept="image/*"
              onChange={handleSelectImages}
              onClick={(event) =>
                ((event.target as HTMLInputElement).value = "")
              }
              multiple
              ref={refs.fileInput}
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
