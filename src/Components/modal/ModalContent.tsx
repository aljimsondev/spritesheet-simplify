import React from "react";
import { NODE } from "../types";
import { LinkData, ModalFooterButtonProps } from "./types";
import imgMultiSprites from "../../assets/multiple_sprites1.jpg";
import imgSingleSprite from "../../assets/single_sprite1.jpg";
import customSizeSprites from "../../assets/custom_size_sprites.png";
import logoImg from "../../assets/logo.png";
import Logo from "../logo/Logo";
import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillGoogleCircle,
  AiOutlineCopyright,
  AiOutlineClose,
} from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { Context } from "../../Store/store";

//TODO add some animations
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

const sectionsData = [
  {
    title: "How it works?",
    paragraph: [
      `Spritesheet Simplify aims to merge your sprites
      into one file called Spritesheet. Most 2D asset pack that
      can be found and purchase online consist of individual sprites. In
      2D game development, spritesheet is used to animate character
      behaviour.
      Spritesheet Generator aim only to merge all your sprites
      into spritesheet that could be use in your game development
      engine.`,
      `I recommended this simple application to those new developers that did not have any software to merge all your 2D sprites because it is easy to use.`,
      `This may not be as powerful as other tools out there but this tool
      could do the job to merge your sprites.`,
    ],
  },
  {
    title: "Creating spritesheet in Column",
    paragraph: [
      `Select all your sprites behaviour in multiple selection and add it
      in the canvas.`,
      `Selected multiple files will be place in 1 row automatically.`,
    ],
    image: {
      className: "mt-2 mx-600",
      src: imgMultiSprites,
      alt: "row_sprites",
    },
  },
  {
    title: "Creating spritesheet in Row",
    paragraph: [
      ` Instead of selecting multiple sprites, you can select sprites
      individually and place it in the canvas to display it in column.`,
    ],
    image: {
      className: "mt-2 mx-600",
      src: imgSingleSprite,
      alt: "col_sprites",
    },
  },
  {
    title: "Track Properties",
    paragraph: [
      ` Instead of selecting multiple sprites, you can select sprites
      individually and place it in the canvas to display it in column.`,
    ],
    adOns: {
      paragraph: [``],
    },
    image: {
      className: "mt-2 mx-600",
      src: imgSingleSprite,
      alt: "col_sprites",
    },
  },
];

const FooterButton: NODE<ModalFooterButtonProps> = ({ data }) => {
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

const ModalContent: NODE<{ toogleState: () => void }> = ({ toogleState }) => {
  return (
    <>
      <div className="modal-header">
        <button
          className="close-button rounded-full absolute right-0 flex items-center justify-center m-4"
          onClick={toogleState}
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className="modal-body">
        <div className="container">
          <div className="modal-inline">
            <div className="logo-base-l mr-1 no-select">
              <img className="logo" src={logoImg} alt="logo" />
            </div>
            <div>
              <h1 className="text-3xl text-gray-800 dark:text-gray-300">
                Spritesheet Simplify
              </h1>
              <p className="text-gray-800 dark:text-gray-300">by aljimsondev</p>
            </div>
          </div>
          {sectionsData.map((data, index) => {
            return (
              <section className="mt-5" key={index + data.title}>
                <h2 className="text-gray-800 dark:text-gray-300 text-2xl font-semibold">
                  {data.title}
                </h2>
                {data.paragraph.map((p) => {
                  return (
                    <p
                      className="text-gray-800 dark:text-gray-300 text-lg my-2"
                      key={p}
                    >
                      {p}
                    </p>
                  );
                })}
                {data.image && (
                  <img
                    className={data.image.className}
                    src={data.image.src}
                    alt={data.image.alt}
                  />
                )}
              </section>
            );
          })}
        </div>
        <div className="modal-footer-base ">
          <div className="modal-footer">
            <div className="footer-left">
              <div className="footer-logo">
                <Logo />
              </div>
              <div className="copyright no-select">
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
    </>
  );
};

export default ModalContent;
