import React from "react";

/**
 * Inputted checked Element 
 * Similar in this JSX Code
 * ```javascript
 * const InputChecked:React.FC<{checked:boolean; onChange}>=({checked,onChange})=> {
        return (
            <div className="flex-1 flex items-center">
                <input
                    type="checkbox"
                    className="input-check mr-3"
                    name="borderLine"
                    checked={checked}
                    onChange={(e) => onUpdateProperties("borderLine", e.target.checked)}
                />
            <label className="text-sm text-gray-800 dark:text-gray-300">
            Show borderline
            </label>
        </div>
        )
    }
 * ```
 */

const InputChecked = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    checked: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }
>(({ label, checked, onChange }, ref) => {
  return React.createElement(
    "div",
    { className: "flex-1 flex items-center" },
    React.createElement("input", {
      type: "checkbox",
      className: "input-check mr-3",
      name: "borderLine",
      checked: checked,
      onChange: onChange,
      ref: ref,
    }),
    React.createElement(
      "label",
      { className: "text-sm text-gray-800 dark:text-gray-300" },
      label
    )
  );
});

export default InputChecked;
