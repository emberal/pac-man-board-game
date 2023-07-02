import React, {forwardRef, ReactEventHandler} from "react";

export interface DropdownProps extends ComponentProps {
  options?: string[],
  onSelect?: ReactEventHandler<HTMLSelectElement>,
}

const Dropdown: FRComponent<DropdownProps, HTMLSelectElement> = forwardRef((
  {
    className,
    options,
    onSelect
  }, ref) => (
  <select ref={ref} className={"border-2 border-gray-300 rounded-md py-1 px-2 bg-white " + className}
          onSelect={onSelect}>
    {
      options?.map((option, index) => (
        <option key={index}>{option}</option>
      ))
    }
  </select>
));

export default Dropdown;
