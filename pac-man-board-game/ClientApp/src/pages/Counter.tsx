import React from "react";
import WebSocketService from "../classes/WebSocketService";

const ws = new WebSocketService({});

export const Counter: Component = () => {

  ws.onReceive = receiveMessage;
  const [currentCount, setCurrentCount] = React.useState(0);

  function incrementCounterAndSend() {
    if (ws.isOpen()) {
      ws.send((currentCount + 1).toString());
    }
  }

  function receiveMessage(data: MessageEvent<any>) {
    const count = parseInt(data.data);
    if (!isNaN(count))
      setCurrentCount(count);
  }

  React.useEffect(() => {
    ws.open();
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
