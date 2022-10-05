import React from "react";
import Tabs from "../../Tabs";
import { Tab } from "../../Tabs/Tab";
import "./sidebar.css";

function Sidebar() {
  return (
    <Tabs>
      <Tab tabLabel="Configuration">
        <div>
          <form>
            <input />
          </form>
        </div>
      </Tab>
      <Tab tabLabel="Preview">
        <h2>Content 1</h2>
      </Tab>
    </Tabs>
  );
}

export default Sidebar;
