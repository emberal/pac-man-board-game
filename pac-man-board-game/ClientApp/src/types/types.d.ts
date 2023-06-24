type MessageEventFunction<T = any> = (data: MessageEvent<T>) => void;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

type ActionMessage<T = any> = {
  Action: import("../websockets/actions").GameAction,
  Data?: T
}

type Action<T> = (obj: T) => void;

type BiAction<T1, T2> = (obj1: T1, obj2: T2) => void;

type Predicate<T> = (obj: T) => boolean;

type SelectedDice = {
  value: number,
  index: number
};

type Position = { x: number, y: number };

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

type Colour = "white" | "red" | "blue" | "yellow" | "green" | "purple" | "grey";
