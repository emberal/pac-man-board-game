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

interface LinkProps extends ChildProps {
  to: string,
  newTab?: boolean,
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
  colour: import("../game/colour").Colour,
  position?: Path | null,
  isEatable?: boolean,
  spawnPosition?: DirectionalPosition | null,
  type?: import("../game/character").CharacterType,
}

interface BoxProps {
  pellets?: number,
  powerPellets?: number,
  readonly colour: import("../game/colour").Colour,
}

interface PlayerProps {
  readonly username: string,
  readonly pacMan?: CharacterProps,
  readonly colour: import("../game/colour").Colour,
  readonly box?: BoxProps,
  state?: import("../game/player").State,
}
