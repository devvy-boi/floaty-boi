import { runtime } from 'webextension-polyfill';
import { createRoot } from 'react-dom/client';

import {AppStateProvider} from './providers/use-app-state';

import App from './app';

export default function main(){
    const root = document.createElement('div');
    root.id = 'floaty-boi-extension-root';

    // set the root element's style
    Object.assign(root.style, {
        position: 'fixed',
        bottom: 0,
        right: 0,
        zIndex: 2147483647,
    });

    // create a shadowDOM
    const shadowDOM = root.attachShadow({ mode: 'open' });

    // import and append our style.css file to the host page's head
    // this file contains what's needed for our CSS modules
    const styleElement = document.createElement('link');
    styleElement.rel = 'stylesheet';
    styleElement.href = runtime.getURL('/style.css');
    document.head.append(styleElement);
    shadowDOM.append(styleElement.cloneNode());

    // append our root element with the shadowDOM to the host page's body
    document.body.append(root);


    // render our app into the shadowDOM
    createRoot(shadowDOM).render(
        <AppStateProvider>
            <App/>
        </AppStateProvider>
    );
}