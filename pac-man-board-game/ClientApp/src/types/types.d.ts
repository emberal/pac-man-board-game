type MessageEventFunction = (data: MessageEvent<any>) => void;

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

type CharacterPosition = { x: number, y: number };
