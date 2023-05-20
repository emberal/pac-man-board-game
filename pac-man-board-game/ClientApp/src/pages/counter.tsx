import React from "react";
import WebSocketService from "../websockets/WebSocketService";

const ws = new WebSocketService("wss://localhost:3000/api/ws");

export const Counter: Component = () => {

  const [currentCount, setCurrentCount] = React.useState(0);

  async function incrementCounterAndSend() {
    if (ws.isOpen()) {
      await ws.send((currentCount + 1).toString());
    }
  }

  function receiveMessage(data: MessageEvent<string>) {
    const count = parseInt(data.data);
    if (!isNaN(count))
      setCurrentCount(count);
  }

  React.useEffect(() => {
    ws.onReceive = receiveMessage;
    ws.open();
    ws.registerEvents();
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Counter</h1>

      <p>This is a simple example of a React component.</p>

      <p aria-live="polite">Current count: <strong>{currentCount}</strong></p>

      <button className="btn btn-primary" onClick={incrementCounterAndSend}>Increment</button>
    </div>
  );
};
