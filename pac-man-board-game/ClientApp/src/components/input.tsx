import React, {forwardRef} from "react";

const Input: FRComponent<InputProps, HTMLInputElement> = forwardRef((
  {
    type = "text",
    className,
    id,
    placeholder,
    required = false,
  }, ref) => (
  <input type={type}
         ref={ref}
         id={id}
         className={"border-2 border-gray-300 rounded-md p-1 " + className}
         placeholder={placeholder}
         required={required}/>
));

export default Input;
