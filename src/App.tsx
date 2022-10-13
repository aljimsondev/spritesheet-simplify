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

  const renderer = new Renderer();

  renderer.setImageSpriteProps({
    borderLine: properties.borderLine,
    imageHeight: properties.height,
    imageWidth: properties.width,
    padding: properties.padding,
  });

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
  const clearSelection = () => {
    //clear selection
    if (buffers.length > 0) {
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
  };

  //handling file input programmatically
  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };
  //download of spritesheet
  const download = React.useCallback(async () => {
    await renderer.download(properties.fileName).then((data) => {
      if (!data) {
        //dispatch notification
        notificationDispatch({
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
    });
  }, [buffers]);

  //runs in first render and reload
  React.useEffect(() => {
    disableZoom(document.getElementById("root")!);
    //fetch blobs to localstorage
    const localBlobs = fetchToLocalStorage("blobs");
    if (!localBlobs) return;
    setBuffers(localBlobs);

    return () => {
      setBuffers([]); //clean up
    };
  }, [reloadApp]);

  React.useEffect(() => {
    try {
      (async () => {
        await renderer.loadBuffers(buffers).then((data) => {});
        if (canvasWrapperRef.current) {
          await renderer.render(canvasWrapperRef.current);
        }
      })();
    } catch (e) {
      console.warn(e);
    }
    return () => {
      //clean up function
    };
  }, [
    buffers,
    properties.height,
    properties.width,
    properties.padding,
    properties.borderLine,
  ]);

  /**
   * HANDLES THE ZOOMING ANND PANNING
   */
  React.useEffect(() => {
    (() => {
      const container = canvasWrapperRef.current!;
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

    (() => {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        console.log(e);
      });
    })();
  }, []);

  return (
    <>
      <div className="main-container">
        <Navbar
          handleSelectImages={handleSelectImages}
          clearSelection={clearSelection}
          downloadButtonRef={downloadButtonRef}
          download={download}
          handleOpenFileInput={handleOpenFileInput}
        />
        <div className="container-grow">
          <div className="canvas-wrapper">
            <div ref={canvasWrapperRef} id="canvas-root"></div>
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
          <Sidebar />
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
