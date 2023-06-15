type Component<T = ComponentProps> = (props: T) => React.JSX.Element | null;

interface ComponentProps {
  className?: string,
  style?: React.CSSProperties,
  id?: string,
  title?: string,
}

interface ChildProps extends ComponentProps {
  children?: React.JSX.Element,
}

interface CharacterProps {
  colour: Colour,
  position?: Path,
  isEatable?: boolean,
  spawnPosition: DirectionalPosition
}

interface PacManProps extends CharacterProps {
  box?: BoxProps,
}

interface BoxProps {
  pellets?: import("../game/pellet").default[],
  readonly colour: Colour,
}

interface PlayerProps {
  readonly character: CharacterProps | PacManProps,
  readonly colour: Colour,
  readonly box: BoxProps,
}
