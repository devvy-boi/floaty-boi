import { createRoot } from 'react-dom/client';

import App from './app';

window.addEventListener('load', () => {
    const appRoot = document.getElementById('app');

    if (!appRoot) {
        throw new Error('Could not find app root');
    }

    const root = createRoot(appRoot);
    root.render(
        <App />
    );
});