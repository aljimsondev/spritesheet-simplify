import React from "react";
import FabComponent from "./Components/button/FabComponent";
import Sidebar from "./Components/sidebar/Sidebar";
import Modal from "./Components/modal";
import ModalContent from "./Components/modal/ModalContent";
import Navbar from "./Components/navbar/Navbar";
import Notification from "./Components/notification/Notification";
import SpritesPreview from "./Components/preview/SpritesPreview";
import { spriteRenderer } from "./renderer/SpriteRender";
import { Context } from "./Store/store";
import { CreateBuffer } from "./Components/AnimationEngine/CreateBuffer";

//TODO add spritesheet preview

function App() {
  const { properties, notification, notificationDispatch } =
    React.useContext(Context);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const downloadButtonRef = React.useRef<HTMLAnchorElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const defaultHeight = 0;
  const defaultWidth = 0;
  const [images, setImages] = React.useState<HTMLImageElement[][]>([]);
  const [buffers, setBuffers] = React.useState<HTMLImageElement[]>([]);
  const [openModal, setModalState] = React.useState<boolean>(false);
  const [openModalPreview, setModalPreviewState] =
    React.useState<boolean>(false);
  const [canvasVisibility, setCanvasVisibility] = React.useState<
    "none" | "block"
  >("none");
  const [imageObserver, setImageObserver] = React.useState<
    {
      height: number;
      width: number;
      index: number;
    }[]
  >([]);
  const toogleState = () => {
    setModalState((prevState) => !prevState);
  };

  //getting the total combine with of the highest column
  function getTotalWidth(index: number) {
    const totalWidthCombine = images[index].reduce((total, img: any) => {
      const props: any = properties; //input value returns string to we need to parse it
      if (props.width) {
        let propsWidth: any = parseFloat(props.width);
        return (total += propsWidth);
      } else {
        return (total += parseInt(img.width));
      }
    }, 0);
    return totalWidthCombine;
  }
  //canvas width calculation
  const canvasWidth = React.useMemo(() => {
    let highestWidth = 0;

    for (let i = 0; i < images.length; i++) {
      let width = getTotalWidth(i);
      if (width > highestWidth) {
        highestWidth = width;
      }
    }

    return highestWidth;
  }, [imageObserver, images, properties.width, properties.height]);

  //canvas height calculation
  const canvasHeight = React.useMemo(() => {
    const props: any = properties;
    //override type to use parsefloat to avoid red warning , yeah i get it im lazy
    const totalInitalHeight = imageObserver.reduce((total, data) => {
      if (properties.height) {
        //custom height
        if (images.length > 1) {
          const combinePropsTotal =
            parseFloat(props.height) + parseFloat(props.padding);
          return combinePropsTotal * imageObserver.length; //with padding
        }
        return parseFloat(props.height) * imageObserver.length; //without padding
      } else {
        if (images.length > 1) {
          return (total += data.height + parseFloat(props.padding)); //with padding
        } else {
          return (total += data.height); //without padding
        }
      }
    }, 0);
    return totalInitalHeight;
  }, [imageObserver, images, properties.height, properties.padding]);
  //handle image selection
  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files!;

    let arr: any[] = [];
    for (const key in Object.keys(files)) {
      let newblob = URL.createObjectURL(files[key]);
      const blobImage = new Image();
      blobImage.src = newblob;
      blobImage.alt = files[key].name;
      blobImage.onload = () => {
        setImageObserver([
          ...imageObserver,
          {
            width: blobImage.width,
            height: blobImage.height,
            index: images.length, //index where the image will be place in the images array
          },
        ]);
      };

      arr.push(blobImage);
    }

    setImages([...images, arr]);
    arr = [];
  };
  //clear state
  const clearSelection = () => {
    //clear selection
    if (images.length > 0) {
      setImages([]);
      setImageObserver([]);
      downloadButtonRef.current!.href = "";
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
  //draw the image
  function drawImage() {
    const canvas = canvasRef.current!;
    if (canvas) {
      const ctx = canvas.getContext("2d")!;
      let currentPositionY = 0;
      if (images.length > 0) {
        canvas.height = canvasHeight;
        canvas.width = canvasWidth; //set canvas width to highest instance of sprites

        for (let row = 0; row < images.length; row++) {
          spriteRenderer({
            context: ctx,
            borderLine: properties.borderLine,
            height: properties.height,
            width: properties.width,
            images: images[row],
            y: currentPositionY,
          });
          if (images.length > 0 && imageObserver[row]) {
            //consist of more than 1 columns, add padding  to give space of each column sprites
            if (properties.height) {
              currentPositionY += properties.height + properties.padding;
            } else {
              currentPositionY +=
                imageObserver[row].height + properties.padding;
            }
          } else if (images.length === 0 && imageObserver[row]) {
            if (properties.height) {
              currentPositionY += properties.height;
            } else {
              currentPositionY += imageObserver[row].height;
            }
          }
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = defaultWidth;
        canvas.height = defaultHeight;
      }
    }
  }

  //handling file input programmatically
  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };
  //download of spritesheet
  const download = () => {
    //handle download
    if (canvasRef.current && images.length > 0) {
      canvasRef.current.toDataURL("image/png");
      const dt = canvasRef.current.toDataURL("image/png");
      downloadButtonRef.current!.href = dt;
      downloadButtonRef.current?.click();
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
        text: "Opss, looks like you have not created any Spritesheet yet!",
        type: "warning",
      },
    });
    return;
  };
  React.useEffect(() => {
    setCanvasVisibility("block");
    try {
      drawImage();
      getBuffers();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      //clean up function
      setCanvasVisibility("none");
    };
  }, [
    imageObserver,
    images,
    properties.height,
    properties.width,
    properties.padding,
    properties.borderLine,
  ]);

  //get all buffers
  const getBuffers = React.useCallback(() => {
    if (images.length > 0) {
      setBuffers(CreateBuffer(images));
    }
  }, [images]);

  //handling of open preview modal
  const toogleModalPreview = () => {
    setModalPreviewState((prevState) => !prevState);
  };

  return (
    <>
      <div className="main-container">
        <div className="grow">
          <Navbar
            handleSelectImages={handleSelectImages}
            clearSelection={clearSelection}
            downloadButtonRef={downloadButtonRef}
            download={download}
            handleOpenFileInput={handleOpenFileInput}
            toogleModalPreview={toogleModalPreview}
          />
          <div id="canvas-wrapper" className="canvas-wrapper">
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
              <a
                id="download"
                className="nav-button centered"
                download={`${
                  properties.fileName + ".png" || "spritesheet.png"
                }`}
                ref={downloadButtonRef}
              ></a>
            </form>
            <canvas
              id="canvas"
              ref={canvasRef}
              style={{ display: canvasVisibility }}
            ></canvas>
          </div>
          <FabComponent onClick={toogleState} />
        </div>
        <Sidebar buffers={buffers} />
        <Modal open={openModal}>
          <ModalContent toogleState={toogleState} />
        </Modal>
        <Modal open={openModalPreview}>
          <SpritesPreview toogleState={toogleModalPreview} images={images} />
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
