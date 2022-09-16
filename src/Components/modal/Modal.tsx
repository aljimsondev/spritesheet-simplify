import React from "react";
import "./Modal.css";
import { Child } from "../types";
import { LinkData, ModalFooterButtonProps, ModalProps } from "./types";
import Logo from "../logo/Logo";
import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillGoogleCircle,
  AiOutlineCopyright,
} from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { Portal } from "../Portal";
import { Context } from "../../Store/store";

const FooterButton: Child<ModalFooterButtonProps> = ({ data }) => {
  const { notificationDispatch } = React.useContext(Context);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.link);

    notificationDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        dismissable: true,
        onClose: () => {
          notificationDispatch({ type: "RESET_NOTIFICATION" });
        },
        open: true,
        text: "Email Address copied in the Clipboard!",
        type: "success",
      },
    });
  };

  return (
    <React.Fragment>
      {data.type === "link" ? (
        <a href={data.link} target="_blank" className="modal-nav-link">
          {data.icon}
        </a>
      ) : (
        <button onClick={copyToClipboard} className="modal-nav-link">
          {data.icon}
        </button>
      )}
    </React.Fragment>
  );
};

const Modal: Child<ModalProps> = ({ open, toogleState }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const data: LinkData[] = [
    {
      icon: <AiFillGithub />,
      link: "https://github.com/aljimsondev",
      type: "link",
    },
    {
      icon: <AiFillTwitterCircle />,
      link: "https://twitter.com/aljimsondev",
      type: "link",
    },
    {
      icon: <AiFillGoogleCircle />,
      link: "aljimson.megrino@gmail.com",
      type: "text",
    },
    {
      icon: <FaFacebook />,
      link: "https://facebook.com/alnstien",
      type: "link",
    },
  ];

  React.useEffect(() => {
    if (open) {
      ref.current?.classList.toggle("--open");
    }
    return () => {
      ref.current?.classList.remove("--open");
    };
  }, [open]);

  //TODO refactor code
  //?add copy links and text
  return (
    <>
      {open && (
        <Portal>
          <div ref={ref} className="modal">
            <div className="modal-content">
              <div className="modal-container">
                <div className="modal-header">
                  {/* <h2 className="modal-title">Spritesheet Generator Usage</h2> */}
                  <button className="modal-close-button" onClick={toogleState}>
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="modal-inline">
                      <div className="logo-base-l mr-1">
                        <img className="logo" src="/logo.png" alt="logo" />
                      </div>
                      <div>
                        <h1>Spritesheet Simplify</h1>
                        <p>by aljimsondev</p>
                      </div>
                    </div>

                    <section className="mt-5">
                      <h2>How it works?</h2>
                      <p className="mt-2">
                        Spritesheet Simplify aims to merge your <b>sprites</b>
                        into one file called <em>Spritesheet</em>. Most 2D asset
                        pack that can be found and purchase online consist of
                        individual sprites. In 2D game development, spritesheet
                        is used to animate character behaviour.
                        <b>Spritesheet Generator</b> aim only to merge all your
                        sprites into spritesheet that could be use in your game
                        development engine.
                      </p>
                      <p className="mt-2">
                        I recommended this simple application to those new
                        developers that did not have any software to merge all
                        your 2D sprites because it is easy to use.
                      </p>
                      <p className="mt-2">
                        This may not be as powerful as other tools out there but
                        this tool could do the job to merge your sprites.
                      </p>
                    </section>
                    <section className="mt-5">
                      <h2>Creating spritesheet in row</h2>
                      <p>
                        Select all your sprites behaviour in multiple selection
                        and add it in the canvas.
                      </p>
                      <p>
                        Selected multiple files will be place in 1 row
                        automatically.
                      </p>
                      <img
                        className="mt-2 mx-600"
                        src="/assets/multiple_sprites1.jpg"
                        alt="row_sprites"
                      />
                    </section>
                    <section className="mt-5">
                      <h2>Creating spritesheet in column</h2>
                      <p>
                        Instead of selecting multiple sprites, you can select
                        sprites individually and place it in the canvas to
                        display it in column.
                      </p>
                      <img
                        className="mt-2 mx-600"
                        src="/assets/single_sprite1.jpg"
                        alt="col_sprites"
                      />
                    </section>
                    <section className="mt-5">
                      <h2>Custom spritesheet image properties</h2>
                      <p>
                        You can also customize the Image properties(width,
                        height and padding) of your spritesheet.
                      </p>
                      <div className="note inline-start mt-1">
                        <p>
                          <b> Note:</b> I recommend not to use custom sprite
                          size when you have many type of behaviour in your
                          sprites, especially when it has different sizes.{" "}
                          <b>Spritesheet Simplify</b> does not support custom
                          size in selected rows and columns. Custom size will be
                          applied to all sprites in the canvas.
                        </p>
                      </div>
                      <img
                        className="mt-2 mx-600"
                        src="/assets/custom_size_sprites.JPG"
                        alt="col_sprites"
                      />
                    </section>
                  </div>
                  <div className="modal-footer-base">
                    <div className="modal-footer">
                      <div className="footer-left">
                        <div className="footer-logo">
                          <Logo />
                        </div>
                        <div className="copyright">
                          <span>
                            <AiOutlineCopyright />
                          </span>
                          All rights reserved. 2022.
                        </div>
                      </div>
                      <div className="modal-footer-content">
                        <ul>
                          {data.map((d, index) => {
                            return (
                              <li key={index + d.link}>
                                <FooterButton data={d} key={index + d.link} />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Modal;
