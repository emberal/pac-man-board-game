type FRComponent<T = ComponentProps, HTML extends HTMLElement = HTMLElement> = React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<HTML>>;

interface ComponentProps {
  className?: string,
  style?: React.CSSProperties,
  id?: string,
  title?: string,
}

interface ChildProps extends ComponentProps {
  children?: React.JSX.Element | string,
}

interface ButtonProps extends ChildProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  disabled?: boolean,
  type?: "button" | "submit" | "reset",
}

interface InputProps extends ComponentProps {
  type?: string,
  placeholder?: string,
  required?: boolean,
  name?: string,
}

interface CharacterProps {
  Colour: import("../game/colour").Colour,
  Position?: Path | null,
  IsEatable?: boolean,
  SpawnPosition?: DirectionalPosition | null,
  Type?: import("../game/character").CharacterType,
}

interface BoxProps {
  Pellets?: import("../game/pellet").default[],
  readonly Colour: import("../game/colour").Colour,
}

interface PlayerProps {
  readonly Username: string,
  readonly PacMan?: CharacterProps,
  readonly Colour: import("../game/colour").Colour,
  readonly Box?: BoxProps,
  State?: import("../game/player").State,
}
