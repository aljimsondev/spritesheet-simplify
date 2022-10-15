import InlineGroup from "../group/InlineGroup";

function NavbarControlGuideList() {
  const guideControlsData = [
    { label: "Zoom in", shortcutKey: "Ctrl + MouseWheelUp" },
    { label: "Zoom out", shortcutKey: "Ctrl + MouseWheelDown" },
    { label: "Drag Canvas", shortcutKey: "Shift + Mousemove" },
    { label: "Reset Canvas Scale", shortcutKey: "Doubleclick" },
  ];
  return (
    <>
      {guideControlsData.map((list, index) => {
        return (
          <InlineGroup
            className="items-center mt-2"
            key={`${list.shortcutKey + index}`}
          >
            <div className="flex-1">
              <p className="text-white text-sm">{list.label}</p>
            </div>
            <p className="nav-options-btn-label">{list.shortcutKey}</p>
          </InlineGroup>
        );
      })}
    </>
  );
}

export default NavbarControlGuideList;
