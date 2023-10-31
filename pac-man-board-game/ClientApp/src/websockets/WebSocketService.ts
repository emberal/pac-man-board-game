import { wait } from "../utils/utils"

interface IWebSocket {
  onOpen?: VoidFunction
  onReceive?: MessageEventFunction
  onClose?: VoidFunction
  onError?: VoidFunction
}

/**
 * WebSocketService class provides a WebSocket client interface for easy communication with a WebSocket server.
 */
export default class WebSocketService implements IWebSocket {
  private ws?: WebSocket
  private readonly _url: string

  constructor(url: string, { onOpen, onReceive, onClose, onError }: IWebSocket = {}) {
    this._url = url
    this._onOpen = onOpen
    this._onReceive = onReceive
    this._onClose = onClose
    this._onError = onError
  }

  private _onOpen?: VoidFunction

  set onOpen(onOpen: VoidFunction) {
    this._onOpen = onOpen
    if (!this.ws) return
    this.ws.onopen = onOpen
  }

  private _onReceive?: MessageEventFunction

  set onReceive(onReceive: MessageEventFunction) {
    this._onReceive = onReceive
    if (!this.ws) return
    this.ws.onmessage = onReceive
  }

  private _onClose?: VoidFunction

  set onClose(onClose: VoidFunction) {
    this._onClose = onClose
    if (!this.ws) return
    this.ws.onclose = onClose
  }

  private _onError?: VoidFunction

  set onError(onError: VoidFunction) {
    this._onError = onError
    if (!this.ws) return
    this.ws.onerror = onError
  }

  /**
   * Checks if the WebSocket is open.
   * @returns {boolean} Returns true if the WebSocket is open, otherwise false.
   */
  public get isOpen(): boolean {
    return this.ws?.readyState === WebSocket?.OPEN
  }

  /**
   * Checks if the WebSocket connection is currently in the process of connecting.
   *
   * @returns {boolean} - Returns 'true' if the WebSocket is connecting, otherwise 'false'.
   */
  public get isConnecting(): boolean {
    return this.ws?.readyState === WebSocket?.CONNECTING
  }

  /**
   * Check if the WebSocket connection is closed.
   *
   * @returns {boolean} Returns true if the WebSocket connection is closed, false otherwise.
   */
  public get isClosed(): boolean {
    return this.ws?.readyState === WebSocket?.CLOSED
  }

  /**
   * Opens a WebSocket connection with the specified URL and sets the event callbacks.
   */
  public open(): void {
    if (typeof WebSocket === "undefined" || this.isConnecting) return
    this.ws = new WebSocket(this._url)
    if (this._onOpen) this.ws.onopen = this._onOpen
    if (this._onReceive) this.ws.onmessage = this._onReceive
    if (this._onClose) this.ws.onclose = this._onClose
    if (this._onError) this.ws.onerror = this._onError
  }

  /**
   * Waits until the "isOpen" condition is met.
   *
   * @returns {Promise<void>} - A promise that resolves when the "isOpen" condition is met.
   */
  public async waitForOpen(): Promise<void> {
    await wait(() => this.isOpen)
    if (this._onOpen) this.onOpen = this._onOpen
  }

  /**
   * Sends data to the WebSocket server. If the data is an ActionMessage object, it will be stringified.
   *
   * @param {ActionMessage | string} data - The data to send. It can be an ActionMessage object or a string.
   */
  public send(data: ActionMessage | string): void {
    if (typeof data !== "string") {
      data = JSON.stringify(data)
    }
    this.ws?.send(data)
  }

  /**
   * Closes the WebSocket connection.
   */
  public close(): void {
    this.ws?.close()
  }
}
