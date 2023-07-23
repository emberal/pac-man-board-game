import {useState} from "react";

/**
 * A hook that returns a boolean value and a function to toggle it. The function can optionally be passed a boolean
 * @param defaultValue The default value of the boolean, defaults to false.
 * @returns A tuple containing the boolean value and a function to toggle it.
 */
export default function useToggle(defaultValue = false): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState(defaultValue);
  const toggleValue = (newValue?: boolean) => newValue ? setValue(newValue) : setValue(!value);
  return [value, toggleValue];
}