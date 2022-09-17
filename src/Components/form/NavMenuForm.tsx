import React from "react";
import { Context } from "../../Store/store";
import Button from "../button/Button";
import Switch from "../switch/Switch";
import { NavMenuInputProps, NODE } from "../types";
import FormInput from "./FormInput";
import "./NavMenuForm.css";
import { defaultStatus } from "../../Store/store";

const NavMenuForm: NODE<NavMenuInputProps> = ({}) => {
  const { setProperties, properties } = React.useContext(Context);
  const { notificationDispatch } = React.useContext(Context);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.value !== "" && e.target.type === "number") {
        setProperties({
          ...properties,
          [e.target.name]: parseFloat(e.target.value),
        });
        return;
      }
      setProperties({ ...properties, [e.target.name]: e.target.value });
      return;
    } catch (e) {
      console.warn(e);
    }
  };

  const handleReset = () => {
    setProperties(defaultStatus);
    notificationDispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        dismissable: true,
        onClose: () => {
          notificationDispatch({ type: "RESET_NOTIFICATION" });
        },
        open: true,
        text: "Successfully reset to defaults!",
        type: "success",
      },
    });
  };
  const handleToogle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProperties({ ...properties, [e.target.name]: e.target.checked });
  };

  return (
    <form className="form">
      <div className="form-group">
        <div className="form-control">
          <h4>Canvas Configuration</h4>
        </div>
        <div className="form-control">
          <p>Spritesheet downloaded name</p>
          <FormInput
            placeholder="spritesheet.png"
            name="fileName"
            value={properties.fileName}
            onValueChange={handleChangeInput}
          />
        </div>
        <div className="form-control">
          <h4>Customize Image Size</h4>
          <div className="form-inline mt-1">
            <div className="m-r1">
              <FormInput
                label="Height"
                name="height"
                onValueChange={handleChangeInput}
                value={properties.height}
                type="number"
              />
            </div>
            <div className="m-l1">
              <FormInput
                label="Width"
                name="width"
                onValueChange={handleChangeInput}
                value={properties.width}
                type="number"
              />
            </div>
          </div>
        </div>
        <div className="form-control">
          <h4>Column padding</h4>
          <FormInput
            name="padding"
            placeholder={`${properties.padding}`}
            onValueChange={handleChangeInput}
            value={properties.padding}
            type="number"
          />
        </div>
        <div className="form-control inline">
          <Switch
            onSwitch={handleToogle}
            checked={properties.borderLine}
            name="borderLine"
          />
          <label className="switch-label sm-900">Show border lines.</label>
        </div>
        <div className="form-control ">
          <Button
            children="Reset to default"
            className="button secondary"
            onClick={handleReset}
          />
        </div>
      </div>
    </form>
  );
};

export default NavMenuForm;
