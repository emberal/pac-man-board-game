import React from "react";
import {useAtom, useAtomValue} from "jotai";
import {selectedDiceAtom, thisPlayerAtom} from "../utils/state";
import {Button} from "./Button";

interface AllDiceProps extends ComponentProps {
  values?: number[],
}

export const AllDice: Component<AllDiceProps> = (
  {
    className,
    values,
  }) => {

  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);

  function handleClick(dice: SelectedDice): void {
    setSelectedDice(dice);
  }

  return (
    <div className={"flex gap-5 justify-center"}>
      {values?.map((value, index) =>
        <Dice key={index}
              className={`${selectedDice?.index === index ? "border-2 border-black" : ""} ${className}`}
              value={value}
              onClick={(value) => handleClick({index, value})}/>)}
    </div>
  );
};

interface DiceProps extends ComponentProps {
  value?: number,
  onClick?: (value: number) => void,
}

export const Dice: Component<DiceProps> = (
  {
    className,
    value,
    onClick,
  }) => {

  const thisPlayer = useAtomValue(thisPlayerAtom);

  function handleClick() {
    if (onClick && value) {
      onClick(value);
    }
  }

  return (
    <Button className={`text-2xl bg-gray-400 px-4 m-1 ${className}`}
            disabled={!thisPlayer?.isTurn()}
            onClick={handleClick}>
      {value?.toString()}
    </Button>
  );
};
