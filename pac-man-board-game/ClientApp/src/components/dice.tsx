import React from "react";

interface AllDiceProps extends ComponentProps {
  values?: number[],
}

export const AllDice: Component<AllDiceProps> = ({className, values}) => {
  return (
    <div className={"flex gap-5 justify-center"}>
      {values?.map((value, index) => <Dice key={index} className={className} value={value}/>)}
    </div>
  );
};

interface DiceProps extends ComponentProps {
  value?: number,
}

export const Dice: Component<DiceProps> = ({className, value}) => (
  <p className={`text-2xl ${className}`}>{value?.toString()}</p>
);
