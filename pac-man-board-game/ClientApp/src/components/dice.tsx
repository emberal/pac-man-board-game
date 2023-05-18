import React from "react";

interface AllDiceProps extends ComponentProps {
  values: number[],
}

export const AllDice: Component<AllDiceProps> = ({className, values}) => {
  return (
    <>
      {values?.map((value, index) => <Dice key={index} className={className}/>)}
    </>
  );
};

interface DiceProps extends ComponentProps {
  value?: number,
}

export const Dice: Component<DiceProps> = ({className, value}) => {
  return (
    <div className={className}>{value?.toString()}</div>
  );
};
