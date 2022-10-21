import React from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Context } from "../../Store/store";
import Accordion from "../accordion";
import TextInput from "../input/TextInput";

const Export: React.FC<{
  exportSpritesheet: (fileName: string) => Promise<void>;
}> = ({ exportSpritesheet }) => {
  const [isPending, startTransition] = React.useTransition();
  const { properties, onUpdateProperties } = React.useContext(Context);
  const [exportingProps, setOpenExporting] = React.useState({
    fileName: "spritesheet.png",
  });

  const handleChangeState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenExporting({ ...exportingProps, [e.target.name]: e.target.value });
    startTransition(() => {
      onUpdateProperties([e.target.name] as any, e.target.value);
    });
  };

  React.useEffect(() => {
    setOpenExporting({ ...exportingProps, fileName: properties.fileName });
    return () => {
      //clean up
    };
  }, []);
  async function _export() {
    await exportSpritesheet(exportingProps.fileName);
  }

  return (
    <Accordion title="EXPORT SPRITESHEET" isOpen={true}>
      <div className="flex-1 flex flex-col mt-3">
        <div className="flex-1 my-2">
          <p className="text-title">SPRITESHEET FILENAME</p>
        </div>
        <TextInput
          name="fileName"
          placeholder="Filename"
          value={exportingProps.fileName}
          onChange={handleChangeState}
        />
      </div>
      <div className="flex-1 relative my-3">
        <button onClick={_export} className="btn-export">
          Export Spritesheet
        </button>
      </div>
    </Accordion>
  );
};

export default React.memo(Export);
