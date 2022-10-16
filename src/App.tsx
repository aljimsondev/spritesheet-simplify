import React from "react";
import FabComponent from "./Components/button/FabComponent";
import Sidebar from "./Components/sidebar/Sidebar";
import Modal from "./Components/modal";
import ModalContent from "./Components/modal/ModalContent";
import Navbar from "./Components/navbar/Navbar";
import Notification from "./Components/notification/Notification";
import { Context } from "./Store/store";
import {
  fetchToLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "./helpers/LocalStorageHelper";
import LoadBase64Images from "./helpers/LoadBase64Files";
import Renderer from "./renderer";
import { disableZoom } from "./EventHandler/DisableZoom";
import Zoomify from "./Zoomify";
import { useDeferredObject } from "./helpers/UseDeferredObject";
import AnimatedLoader from "./Components/Loader/AnimatedLoader";
import { CanvasZoomDrag } from "./EventHandler/CanvasZoomDrag";

function App() {
  const {
    properties,
    notification,
    notificationDispatch,
    reloadApp,
    buffers,
    setBuffers,
  } = React.useContext(Context);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const downloadButtonRef = React.useRef<HTMLAnchorElement>(null);
  const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
  const [openModal, setModalState] = React.useState<boolean>(false);
  const deferredCanvasBg = useDeferredObject(properties, "canvasBackground");
  const deferredBorderColor = useDeferredObject(properties, "borderColor");
  const deferredPadding = useDeferredObject(properties, "padding");
  const deferredBorderWidth = useDeferredObject(properties, "borderWidth");
  const deferredBorderLine = useDeferredObject(properties, "borderLine");
  const [loading, setLoading] = React.useState(true);
  const [spritesheets, setSpritesheets] = React.useState<HTMLImageElement[]>(
    []
  );
  const renderer = new Renderer();
  disableZoom(document.getElementById("root")!);

  const toogleState = () => {
    setModalState((prevState) => !prevState);
  };

  //handle image selection
  const handleSelectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;

    const data = await LoadBase64Images(files);
    setBuffers([...buffers, data]);
    saveToLocalStorage("blobs", [...buffers, data]);
  };

  //clear buffers
  const clearSelection = React.useCallback(() => {
    if (buffers.length <= 0) return;
    removeFromLocalStorage("blobs"); //remove buffers
    setBuffers([]);
    return notificationDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        dismissable: true,
        onClose: () => {
          notificationDispatch({ type: "RESET_NOTIFICATION" });
        },
        open: true,
        text: "Canvas is cleared successfully!",
        type: "success",
      },
    });
  }, [buffers]);
  //handling file input programmatically
  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };
  //download of spritesheet
  const download = React.useCallback(
    async (fileName: string) => {
      await renderer.download(fileName).then((data) => {
        if (!data) {
          //dispatch notification
          return notificationDispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              dismissable: true,
              onClose: () => {
                notificationDispatch({ type: "RESET_NOTIFICATION" });
              },
              open: true,
              text: "Opss, looks like you have not created any Spritesheet yet!",
              type: "warning",
            },
          });
        }
        //success
        notificationDispatch({
          type: "ADD_NOTIFICATION",
          payload: {
            dismissable: true,
            onClose: () => {
              notificationDispatch({ type: "RESET_NOTIFICATION" });
            },
            open: true,
            text: "Generating Spritesheet success!",
            type: "success",
          },
        });
      });
    },
    [buffers]
  );

  //runs in first render and reload
  React.useEffect(() => {
    //enable zoom drag
    CanvasZoomDrag(canvasWrapperRef.current!);
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

  //load the renderer
  const load = async () => {
    renderer.setImageSpriteProps({
      borderLine: deferredBorderLine as boolean,
      imageHeight: properties.height,
      imageWidth: properties.width,
      padding: deferredPadding as number,
      borderWidth: deferredBorderWidth as number,
      borderColor: deferredBorderColor as string,
    });
    await renderer.loadBuffers(buffers).then(async (data) => {
      if (canvasWrapperRef.current && !loading) {
        await renderer.render(canvasWrapperRef.current);
        await renderer.createSpritesheets().then((s_sheets) => {
          //create sprites to pass in preview later
          setSpritesheets(s_sheets);
        });
        renderer.getYPositions();
        renderer.donwloadDataJSON();
      }
    });
  };

  //renderer initialization
  React.useEffect(() => {
    load();
    return () => {
      //clean up function
      document.getElementById("renderer-canvas")?.remove();
    };
  }, [
    buffers,
    loading,
    deferredBorderColor,
    deferredBorderLine,
    deferredBorderWidth,
    deferredCanvasBg,
    deferredPadding,
  ]);
  //TODO add dialog
  //TODO fix modal
  //!FIX ME fix tooltip position
  //?add dialog
  //?create getPosition handler for spritesheets

  return (
    <>
      <div className="main-container">
        <Navbar
          handleSelectImages={handleSelectImages}
          clearSelection={clearSelection}
          downloadButtonRef={downloadButtonRef}
          handleOpenFileInput={handleOpenFileInput}
        />
        <div className="container-grow">
          {loading && <AnimatedLoader />}
          <div className="canvas-wrapper">
            <div
              ref={canvasWrapperRef}
              id="canvas-root"
              style={{
                background: properties.displayCanvasBackground
                  ? properties.canvasBackground
                  : "transparent",
              }}
            ></div>
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
              ref={fileInputRef}
            />
          </form>
          <FabComponent onClick={toogleState} />
          <Sidebar exportSpritesheet={download} spritesheets={spritesheets} />
        </div>

        <Modal open={openModal}>
          <ModalContent toogleState={toogleState} />
        </Modal>
        <Notification
          type={notification.type}
          open={notification.open}
          onClose={notification.onClose}
          dismissable={notification.dismissable}
          text={notification.text}
        />
      </div>
    </>
  );
}

export default App;
