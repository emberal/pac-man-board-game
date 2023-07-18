type MessageEventFunction<T = any> = (data: MessageEvent<T>) => void;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

type ActionMessage<T = any> = {
  readonly Action: import("../utils/actions").GameAction,
  readonly Data?: T
}

type Action<T> = (obj: T) => void;

type BiAction<T1, T2> = (obj1: T1, obj2: T2) => void;

type Predicate<T> = (obj: T) => boolean;

type SelectedDice = {
  value: number,
  index: number
};

type Position = { X: number, Y: number };

type GameMap = number[][];

type DirectionalPosition = {
  At: Position,
  Direction: import("../game/direction").Direction
}

type Path = {
  Path?: Position[] | null,
  End: Position,
  Direction: import("../game/direction").Direction
}

type GameGroup = {
  readonly id: string,
  readonly count: number,
  readonly isGameStarted: boolean,
}
