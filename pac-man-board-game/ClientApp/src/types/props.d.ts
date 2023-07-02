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
  Colour: Colour,
  Position?: Path | null,
  IsEatable?: boolean,
  SpawnPosition?: DirectionalPosition | null,
  Type?: import("../game/character").CharacterType,
}

interface BoxProps {
  pellets?: import("../game/pellet").default[],
  readonly colour: Colour,
}

interface PlayerProps {
  readonly Name: string,
  readonly PacMan?: CharacterProps,
  readonly Colour: Colour,
  readonly Box?: BoxProps,
  State?: import("../game/player").State,
}
