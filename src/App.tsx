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
import { useDeferredObject } from "./helpers/UseDeferredObject";
import AnimatedLoader from "./Components/Loader/AnimatedLoader";
import { CanvasZoomDrag } from "./EventHandler/CanvasZoomDrag";
import { LocalStates, UpdateSpritesheetColumn } from "./types/main";
import Logo from "./Components/logo/Logo";
import NavbarMain from "./Components/navbar";

function App() {
  const {
    properties,
    notification,
    notificationDispatch,
    reloadApp,
    buffers,
    setBuffers,
    onUpdateProperties,
  } = React.useContext(Context);

  const refs = {
    fileInput: React.useRef<HTMLInputElement>(null),
    downloadButton: React.useRef<HTMLAnchorElement>(null),
    canvasWrapper: React.useRef<HTMLDivElement>(null),
  };

  const [localState, setLocalState] = React.useState<LocalStates>({
    loading: true,
    spritesheets: [],
    update: false,
  });
  const [loading, setLoading] = React.useState(true);
  const deferredCanvasBg = useDeferredObject(properties, "canvasBackground");
  const deferredBorderColor = useDeferredObject(properties, "borderColor");
  const deferredPadding = useDeferredObject(properties, "padding");
  const deferredBorderWidth = useDeferredObject(properties, "borderWidth");
  const deferredBorderLine = useDeferredObject(properties, "borderLine");
  const deferredHeight = useDeferredObject(properties, "height");
  const deferredWidth = useDeferredObject(properties, "width");
  const deferredUpdateStatus = useDeferredObject(properties, "updated");
  const [openModal, setOpenModal] = React.useState(false);
  const renderer = new Renderer();

  const updateModalState = React.useCallback(() => {
    setOpenModal((prevState) => !prevState);
  }, [openModal]);

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
  //for the properties
  const spritesProperties = React.useMemo(() => {
    return {
      deferredBorderColor,
      deferredBorderLine,
      deferredBorderWidth,
      deferredPadding,
      deferredHeight,
      deferredWidth,
      deferredUpdateStatus,
    };
  }, [
    deferredBorderColor,
    deferredBorderLine,
    deferredBorderWidth,
    deferredPadding,
    deferredHeight,
    deferredWidth,
    deferredUpdateStatus,
  ]);

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
    [
      buffers,
      //  localState.loading,
      //   spritesProperties
    ]
  );
  //clear buffers
  const clearSelection = React.useCallback(() => {
    if (buffers.length <= 0) return;
    removeFromLocalStorage("blobs"); //remove buffers
    setBuffers([]);
    setLocalState({ ...localState, spritesheets: [] });
    renderer.clear();

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
  const handleOpenFileInput = React.useCallback(() => {
    refs.fileInput.current?.click();
  }, []);
  //runs in first render and reload
  React.useEffect(() => {
    //disable zoom in root element
    disableZoom(document.getElementById("root")!);
    //set draggable element
    //enable zoom drag
    CanvasZoomDrag(refs.canvasWrapper.current!);
    //fetch blobs to localstorage
    const localBlobs = fetchToLocalStorage("blobs");
    (async () => {
      if (localBlobs) {
        setBuffers(localBlobs);
      }
    })();
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
      padding: deferredPadding as number,
      borderWidth: deferredBorderWidth as number,
      borderColor: deferredBorderColor as string,
    });
    await renderer.loadBuffers(buffers).then(async (data) => {
      if (refs.canvasWrapper.current && !loading && data) {
        await renderer.render(refs.canvasWrapper.current);
        await renderer.createSpritesheets().then((s_sheets) => {
          //create sprites to pass in preview later
          setLocalState({ ...localState, spritesheets: s_sheets });
        });
      }
    });
  };

  //update canvas row handler
  const updateSpritesheetColumnHandler: UpdateSpritesheetColumn =
    React.useCallback(
      (arrayIndex: number, width: number, height: number) => {
        const newBuffers = renderer.updateColumnData(arrayIndex, width, height);
        if (newBuffers && newBuffers.length > 0) {
          setBuffers(newBuffers);
          saveToLocalStorage("blobs", newBuffers);
        }
      },
      [buffers]
    );

  //renderer initialization
  React.useEffect(() => {
    load();
    return () => {
      //clean up function
      document.getElementById("renderer-canvas")?.remove(); //remove the canvas on rerender
    };
  }, [
    buffers, //whenever new buffer added
    loading, //whenever is reload activated
    spritesProperties, //whenever sprites props
    deferredCanvasBg, //whenever canvas bg changes
    localState.update,
  ]);
  //TODO add dialog
  //TODO optimize performance
  //tODO add export in json
  return (
    <>
      <div className="main-container">
        <NavbarMain
          handleSelectImages={handleSelectImages}
          clearSelection={clearSelection}
          handleOpenFileInput={handleOpenFileInput}
        />
        <div className="container-grow">
          {loading && <AnimatedLoader />}
          <div className="canvas-wrapper">
            <div
              ref={refs.canvasWrapper}
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
              ref={refs.fileInput}
            />
          </form>
          <FabComponent onClick={updateModalState} />
          <Sidebar
            exportSpritesheet={download}
            spritesheets={localState.spritesheets}
            updateSpritesheetColumn={updateSpritesheetColumnHandler}
          />
        </div>

        <Modal open={openModal}>
          <ModalContent toogleState={updateModalState} />
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
