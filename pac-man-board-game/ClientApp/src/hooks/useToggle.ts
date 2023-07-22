import {useState} from "react";

export default function useToggle(defaultValue = false): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState(defaultValue);
  const toggleValue = (newValue?: boolean) => newValue ? setValue(newValue) : setValue(!value);
  return [value, toggleValue];
}