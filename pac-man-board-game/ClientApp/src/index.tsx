import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {App} from './App';
// @ts-ignore
import reportWebVitals from './reportWebVitals';
import {DevTools} from "jotai-devtools";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error("Root element is null");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter basename={baseUrl ?? undefined}>
    <DevTools/>
    <App/>
  </BrowserRouter>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
