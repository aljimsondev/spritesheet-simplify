import React from "react";

const Tabs: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChangeActiveTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const renderTab = React.useCallback(() => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        onClick: () => {
          handleChangeActiveTab(index);
        },
        tabIndex: index,
        isActive: index === activeTab,
      });
    });
  }, [activeTab]);

  const renderContent = React.useCallback(() => {
    if (children[activeTab]) {
      return children[activeTab].props.children;
    }
  }, [activeTab]);

  return (
    <div className="sidebar">
      <div className="sidebar-heading">{renderTab()}</div>
      <div className="sidebar-content">{renderContent()}</div>
    </div>
  );
};

export default Tabs;
