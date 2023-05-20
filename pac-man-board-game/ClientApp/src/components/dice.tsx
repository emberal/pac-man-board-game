import React from "react";

interface AllDiceProps extends ComponentProps {
  values?: number[],
  onclick?: (dice: SelectedDice) => void,
  selectedDiceIndex: number | undefined
}

export const AllDice: Component<AllDiceProps> = (
  {
    className,
    values,
    onclick,
    selectedDiceIndex
  }) => {

  function handleClick(index: SelectedDice) {
    if (onclick) {
      onclick(index);
    }
  }

  return (
    <div className={"flex gap-5 justify-center"}>
      {values?.map((value, index) =>
        <Dice key={index}
              className={`${selectedDiceIndex === index ? "border-2 border-black" : ""} ${className}`}
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

  function handleClick() {
    if (onClick && value) {
      onClick(value);
    }
  }

  return (
    <button className={`text-2xl bg-gray-400 px-4 m-1 ${className}`} onClick={handleClick}>
      {value?.toString()}
    </button>
  );
};
