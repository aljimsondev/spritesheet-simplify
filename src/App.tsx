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

function App() {
  const {
    properties,
    notification,
    notificationDispatch,
    reloadApp,
    buffers,
    setBuffers,
    handleReload,
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
  const renderer = new Renderer();
  disableZoom(document.getElementById("root")!);

  const toogleState = () => {
    setModalState((prevState) => !prevState);
  };

  //handle image selection
  const handleSelectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;

    const data = await LoadBase64Images(files); // now holds that images
    setBuffers([...buffers, data]); //append new data in the buffers
    saveToLocalStorage("blobs", [...buffers, data]); // save to local storage
  };

  //clear state
  const clearSelection = React.useCallback(() => {
    if (buffers.length > 0 && !loading) {
      removeFromLocalStorage("blobs"); //remove buffers
      setBuffers([]);
      //dispatch notification
      notificationDispatch({
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
      return;
    }
    //dispatch notification
    notificationDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        dismissable: true,
        onClose: () => {
          notificationDispatch({ type: "RESET_NOTIFICATION" });
        },
        open: true,
        text: "Canvas is empty, please fill some sprites.",
        type: "warning",
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
    //fetch blobs to localstorage
    const localBlobs = fetchToLocalStorage("blobs");
    if (localBlobs) {
      setBuffers(localBlobs);
    }
    //optional but i love to view this before rending :)
    const loadingTimer = setTimeout(() => {
      if (!reloadApp) {
        setLoading(false);
      }
    }, Math.random() * 2000);

    return () => {
      setBuffers([]); //clean up
      setLoading(true);
      clearTimeout(loadingTimer);
    };
  }, [reloadApp]);

  //load the renderer
  async function load() {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        switch (e.code) {
          case "KeyR":
            //reload app
            handleReload();
            return;
          case "KeyX":
            return clearSelection(); //clear canvas
          default:
            return;
        }
      }
    });
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
      }
    });
  }

  //renderer initialization
  React.useEffect(() => {
    try {
      load();
    } catch (e) {
      console.warn(e);
    }

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

  /**
   * HANDLES THE EVENTs
   */
  React.useEffect(() => {
    const container = canvasWrapperRef.current!;
    (() => {
      if (container) {
        const instance = Zoomify({
          minScale: 0.1,
          maxScale: 30,
          element: container,
          scaleSensitivity: 30,
        });
        container.addEventListener("wheel", (event) => {
          if (event.ctrlKey) {
            instance.zoom({
              deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
              x: event.pageX,
              y: event.pageY,
            });
          }
        });
        container.addEventListener("dblclick", () => {
          instance.panTo({
            originX: 0,
            originY: 0,
            scale: 1,
          });
        });
        container.addEventListener("mousemove", (event) => {
          event.preventDefault();
          if (!event.shiftKey) {
            return;
          }
          instance.panBy({
            originX: event.movementX,
            originY: event.movementY,
          });
        });
      }
    })();
  }, []);

  //TODO add dialog
  //TODO fix modal
  //?add dialog
  //?create getPosition handler for spritesheets

  return (
    <>
      <div className="main-container">
        <Navbar
          handleSelectImages={handleSelectImages}
          clearSelection={clearSelection}
          downloadButtonRef={downloadButtonRef}
          download={() => {}}
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
          <Sidebar exportSpritesheet={download} />
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
