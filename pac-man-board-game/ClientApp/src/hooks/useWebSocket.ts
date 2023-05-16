type VoidFunction = () => void;
type MessageEventFunction = (data: MessageEvent<any>) => void;

interface IWebSocket {
  onOpen?: VoidFunction,
  onReceive?: MessageEventFunction,
  onClose?: VoidFunction,
  onError?: VoidFunction
}

export default class WebSocketService {
  private ws: WebSocket;
  private _onOpen?: VoidFunction;
  private _onReceive?: MessageEventFunction;
  private _onClose?: VoidFunction;
  private _onError?: VoidFunction;

  constructor({onOpen, onReceive, onClose, onError}: IWebSocket) {
    this.ws = new WebSocket("wss://localhost:3000/api/ws");
    if (onOpen) this.ws.onopen = onOpen;
    if (onReceive) this.ws.onmessage = onReceive;
    if (onClose) this.ws.onclose = onClose;
    if (onError) this.ws.onerror = onError;
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.ws.send(data);
  }

  public close() {
    this.ws.close();
  }

  public isOpen() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  set onOpen(onOpen: VoidFunction) {
    this.ws.onopen = onOpen;
    this._onOpen = onOpen;
  }

  set onReceive(onReceive: MessageEventFunction) {
    this.ws.onmessage = onReceive;
    this._onReceive = onReceive;
  }

  set onClose(onClose: VoidFunction) {
    this.ws.onclose = onClose;
    this._onClose = onClose;
  }

  set onError(onError: VoidFunction) {
    this.ws.onerror = onError;
    this._onError = onError;
  }
}