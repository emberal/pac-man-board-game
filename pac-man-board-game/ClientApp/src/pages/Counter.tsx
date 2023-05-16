import React from "react";

const ws = new WebSocket("wss://localhost:3000/api/");

let isWsOpen = false;

ws.onopen = () => {
  isWsOpen = true;
  console.log("WebSocket Client Connected");
};

ws.onmessage = (data) => {
  console.log(`Received message: ${data}`);
};

ws.onerror = (err) => {
  console.error(err);
};

ws.onclose = () => {
  console.log("WebSocket Client Disconnected");
};

export const Counter: Component = () => {

  const [currentCount, setCurrentCount] = React.useState(0);

  function incrementCounter() {
    setCurrentCount(currentCount + 1);
  }

  React.useEffect(() => {

    if (isWsOpen) {
      ws.send(`Current count: ${currentCount}`);
    }
  }, [currentCount]);

  return (
    <div>
      <h1>Counter</h1>

      <p>This is a simple example of a React component.</p>

      <p aria-live="polite">Current count: <strong>{currentCount}</strong></p>

      <button className="btn btn-primary" onClick={incrementCounter}>Increment</button>
    </div>
  );
};
