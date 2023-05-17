interface IWebSocket {
  onOpen?: VoidFunction,
  onReceive?: MessageEventFunction,
  onClose?: VoidFunction,
  onError?: VoidFunction
}

export default class WebSocketService {
  private ws?: WebSocket;
  private _onOpen?: VoidFunction;
  private _onReceive?: MessageEventFunction;
  private _onClose?: VoidFunction;
  private _onError?: VoidFunction;

  constructor({onOpen, onReceive, onClose, onError}: IWebSocket) {
    this._onOpen = onOpen;
    this._onReceive = onReceive;
    this._onClose = onClose;
    this._onError = onError;
  }

  public open(): void {
    this.ws = new WebSocket("wss://localhost:3000/api/ws");
    if (this._onOpen) this.ws.onopen = this._onOpen;
    if (this._onReceive) this.ws.onmessage = this._onReceive;
    if (this._onClose) this.ws.onclose = this._onClose;
    if (this._onError) this.ws.onerror = this._onError;
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.ws?.send(data);
  }

  public close() {
    this.ws?.close();
  }

  public isOpen() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  set onOpen(onOpen: VoidFunction) {
    this._onOpen = onOpen;
    if (!this.ws) return;
    this.ws.onopen = onOpen;
  }

  set onReceive(onReceive: MessageEventFunction) {
    this._onReceive = onReceive;
    if (!this.ws) return;
    this.ws.onmessage = onReceive;
  }

  set onClose(onClose: VoidFunction) {
    this._onClose = onClose;
    if (!this.ws) return;
    this.ws.onclose = onClose;
  }

  set onError(onError: VoidFunction) {
    this._onError = onError;
    if (!this.ws) return;
    this.ws.onerror = onError;
  }
}