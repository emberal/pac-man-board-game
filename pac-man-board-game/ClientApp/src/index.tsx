import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {App} from './App';
// @ts-ignore
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// @ts-ignore
import reportWebVitals from './reportWebVitals';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
// @ts-ignore
const root = createRoot(rootElement);

root.render(
    <BrowserRouter basename={baseUrl ?? undefined}>
        <App/>
    </BrowserRouter>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
