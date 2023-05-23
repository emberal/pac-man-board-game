type MessageEventFunction<T = any> = (data: MessageEvent<T>) => void;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;

type ActionMessage<T = any> = {
  Action: import("../websockets/actions").Action,
  Data?: T
}

type SelectedDice = {
  value: number,
  index: number
};

type Position = { x: number, y: number };

type GameMap = number[][];
