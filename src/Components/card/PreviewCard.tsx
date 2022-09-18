import React from "react";
import FormInput from "../form/FormInput";
import { FaPlay } from "react-icons/fa";

const PreviewCard = () => {
  const [properties, setProperties] = React.useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    fps: 0,
  });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        const val: number = parseFloat(e.target.value);
        setProperties({ ...properties, [e.target.name]: val });
        return;
      }
      setProperties({ ...properties, [e.target.name]: e.target.value });
    },
    []
  );

  return (
    <div className="card-base ">
      <div className="inline  ">
        <canvas id="canvas-preview"></canvas>
        <div className="inline ">
          <form>
            <section className="form-group   ">
              <div className="form-control">
                <h3>Sprite Animation Preview</h3>
              </div>
              <div className="form-control">
                <FormInput
                  onValueChange={handleChange}
                  classList="with-label"
                  value={properties.fps}
                  label="FPS"
                  name="fps"
                  type="number"
                />
              </div>
              <div className="form-control">
                <p>Sprite Properties</p>
              </div>
              <div className="inline flex-end rel">
                <div>
                  <div className="form-control inline">
                    <div className="inline mr-1">
                      <FormInput
                        onValueChange={handleChange}
                        value={properties.x}
                        name="x"
                        label="X"
                        type="number"
                        classList="with-label b-none "
                      />
                    </div>
                    <div className="inline">
                      <FormInput
                        onValueChange={handleChange}
                        value={properties.y}
                        label="Y"
                        name="y"
                        type="number"
                        classList="with-label b-none"
                      />
                    </div>
                  </div>
                  <div className="form-control inline">
                    <div className="mr-1">
                      <FormInput
                        onValueChange={handleChange}
                        value={properties.height}
                        label="H"
                        type="number"
                        name="height"
                        classList="with-label"
                      />
                    </div>
                    <div className="inline">
                      <FormInput
                        onValueChange={handleChange}
                        value={properties.width}
                        label="W"
                        name="width"
                        type="number"
                        classList="with-label b-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-btn-base">
                  <div className="card-btn no-select centered">
                    <FaPlay size={30} />
                  </div>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;
