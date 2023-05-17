import React from "react";
import WebSocketService from "../classes/WebSocketService";

const ws = new WebSocketService({});

export const Counter: Component = () => { // TODO update values from different clients at the same time

  ws.onReceive = receiveMessage;
  const [currentCount, setCurrentCount] = React.useState(0);

  function incrementCounterAndSend() {
    setCurrentCount(currentCount + 1);
    if (ws.isOpen()) {
      ws.send(`Current count: ${currentCount}`);
    }
  }

  function receiveMessage(data: MessageEvent<any>) {
    setCurrentCount(currentCount + 1);
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
