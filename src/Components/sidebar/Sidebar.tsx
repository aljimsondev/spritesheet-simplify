import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import NavMenuForm from "../form/NavMenuForm";
import "./sidebar.css";
import PreviewCard from "../card/PreviewCard";
import { Context } from "../../Store/store";

const Sidebar: React.FC<{}> = () => {
  const { buffers, sidebarRef } = React.useContext(Context);

  return (
    <div ref={sidebarRef} className="sidebar-base">
      <Tabs>
        <Tab tabLabel="Preview">
          <div className="preview-base">
            {buffers.length <= 0 ? (
              <div className="centered mt-1 flex flex-col">
                <h4>No Available Preview</h4>
                <p>Add some sprites in the canvas</p>
              </div>
            ) : (
              buffers.map((buffer, index) => {
                return (
                  <PreviewCard key={buffer.dataset.props} buffer={buffer} />
                );
              })
            )}
          </div>
        </Tab>
        <Tab tabLabel="Configuration">
          <div className="form-base">
            <NavMenuForm />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default React.memo(Sidebar);
