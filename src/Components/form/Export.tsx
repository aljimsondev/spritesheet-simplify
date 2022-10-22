import React from "react";
import { Context } from "../../Store/store";
import { ExportSpritesheetType } from "../../types/types";
import Accordion from "../accordion";
import InputChecked from "../input/InputChecked";
import TextInput from "../input/TextInput";

const Export: React.FC<{
  exportSpritesheet: ExportSpritesheetType;
}> = ({ exportSpritesheet }) => {
  const [isPending, startTransition] = React.useTransition();
  const { properties, onUpdateProperties } = React.useContext(Context);
  const [exportingProps, setOpenExporting] = React.useState({
    fileName: "spritesheet.png",
    includeJSON: true,
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
  // async function _export() {
  //   await exportSpritesheet(exportingProps.fileName, {
  //     withJSON: exportingProps.includeJSON,
  //   });
  // }
  const _export = React.useCallback(async () => {
    await exportSpritesheet(exportingProps.fileName, {
      withJSON: exportingProps.includeJSON,
    });
  }, [exportingProps]);

  const toogleJSONInclusion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenExporting({ ...exportingProps, includeJSON: e.target.checked });
  };

  return (
    <Accordion title="EXPORT SPRITESHEET" isOpen={true}>
      <div className="flex-1 flex flex-col mt-3">
        <InputChecked
          checked={exportingProps.includeJSON}
          onChange={toogleJSONInclusion}
          label="Include JSON file"
        />
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
