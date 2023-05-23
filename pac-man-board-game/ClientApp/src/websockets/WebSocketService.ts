interface IWebSocket {
  onOpen?: VoidFunction,
  onReceive?: MessageEventFunction,
  onClose?: VoidFunction,
  onError?: VoidFunction
}

export default class WebSocketService {
  private ws?: WebSocket;
  private readonly _url: string;
  private _onOpen?: VoidFunction;
  private _onReceive?: MessageEventFunction;
  private _onClose?: VoidFunction;
  private _onError?: VoidFunction;

  constructor(url: string, {onOpen, onReceive, onClose, onError}: IWebSocket = {}) {
    this._url = url;
    this._onOpen = onOpen;
    this._onReceive = onReceive;
    this._onClose = onClose;
    this._onError = onError;
  }

  public open(): void {
    if (typeof WebSocket === "undefined") return;
    this.ws = new WebSocket(this._url);
    if (this._onOpen) this.ws.onopen = this._onOpen;
    if (this._onReceive) this.ws.onmessage = this._onReceive;
    if (this._onClose) this.ws.onclose = this._onClose;
    if (this._onError) this.ws.onerror = this._onError;
  }

  public send(data: ActionMessage | string): void {
    if (typeof data !== "string") {
      data = JSON.stringify(data);
    }
    this.ws?.send(data);
  }
  
  public async sendAndReceive<R>(data: ActionMessage): Promise<R> {
    if (!this.isOpen()) return Promise.reject("WebSocket is not open");

    let result: R | undefined;
    this.ws!.onmessage = (event: MessageEvent<string>) => {
      result = JSON.parse(event.data) as R;
    };

    this.send(data);
    return new Promise<R>((resolve) => {
      const f = () => {
        if (result === undefined) {
          setTimeout(f, 50);
          return;
        }
        const resolved = resolve(result);
        if (this._onReceive) this.onReceive = this._onReceive;
        return resolved;
      };

      f();
    });
  }

  public close(): void {
    this.ws?.close();
  }

  public isOpen(): boolean {
    return this.ws?.readyState === WebSocket?.OPEN;
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
