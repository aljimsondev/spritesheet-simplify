import React from "react";

const Tabs: React.FC<{ children: any }> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const childCount = React.Children.count(children);
  const currentFocusChild = React.useRef(null);
  const handleChangeActiveTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  React.useEffect(() => {}, []);

  const renderTab = React.useCallback(() => {
    if (childCount === 1) {
      return React.cloneElement(React.Children.only(children), {
        onClick: () => {
          handleChangeActiveTab(0);
        },
        ariaSelected: activeTab,
        tabIndex: 0,
        isActive: 1,
      });
    }

    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        onClick: () => {
          handleChangeActiveTab(index);
        },
        ariaSelected: activeTab,
        tabIndex: index,
        isActive: index === activeTab,
      });
    });
  }, [activeTab]);

  const renderContent = React.useCallback(() => {
    if (childCount > 1) {
      return React.Children.only(children[activeTab]).props.children;
    } else {
      return React.Children.only(children).props.children;
    }
  }, [
    activeTab,
    React.Children.only(children[activeTab]).props.children ||
      React.Children.only(children).props.children,
  ]);

  return (
    <div className="sidebar">
      <div className="sidebar-heading">{renderTab()}</div>
      <div className="sidebar-content">{renderContent()}</div>
    </div>
  );
};

export default React.memo(Tabs);
