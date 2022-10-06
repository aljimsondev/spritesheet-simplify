import React from "react";
import Tabs from "../Tabs";
import { Tab } from "../Tabs/Tab";
import NavMenuForm from "../form/NavMenuForm";
import "./sidebar.css";
import PreviewCard from "../card/PreviewCard";

const Sidebar: React.FC<{
  buffers: (HTMLImageElement | undefined)[];
}> = ({ buffers }) => {
  return (
    <Tabs>
      <Tab tabLabel="Configuration">
        <div className="form-base">
          <NavMenuForm />
        </div>
      </Tab>
      <Tab tabLabel="Preview">
        <div className="preview-base">
          {buffers.map((buffer, index) => {
            return (
              <PreviewCard
                key={`${Math.random() * 10} + ${index}`}
                buffer={buffer}
              />
            );
          })}
        </div>
      </Tab>
    </Tabs>
  );
};

export default React.memo(Sidebar);
