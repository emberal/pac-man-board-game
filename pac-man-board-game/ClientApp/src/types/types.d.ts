type MessageEventFunction = (data: MessageEvent<any>) => void;

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type WebSocketData = string | ArrayBufferLike | Blob | ArrayBufferView;
