type MessageEventFunction<T = any> = (data: MessageEvent<T>) => void;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

type ActionMessage<T = any> = {
  Action: import("../websockets/actions").GameAction,
  Data?: T
}

type Action<T> = (obj: T) => void;

type SelectedDice = {
  value: number,
  index: number
};

type Position = { x: number, y: number };

type GameMap = number[][];

type DirectionalPosition = {
  at: Position,
  direction: import("../game/direction").Direction
}

type Path = {
  path?: Position[],
  end: Position,
  direction: import("../game/direction").Direction
}

type Colour = "white" | "red" | "blue" | "yellow" | "green" | "purple" | "grey";
