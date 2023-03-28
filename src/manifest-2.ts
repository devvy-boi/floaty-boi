import { Manifest } from 'webextension-polyfill';

// manifest v2 version
const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: 'Floaty Boi',
    version: '0.0.1',
    description: 'Unofficial Floatplane quality of life extension',
    background: {
        page: 'src/background/index.html',
    },
    permissions: [
        'storage',
    ],
    browser_action: {
        default_popup: 'src/action/index.html',
        default_icon: 'assets/icon.png',
    },
    content_scripts: [
        {
            matches: [
                'https://*.floatplane.com/*',
            ],
            js: [
                'content-script.iife.js',
            ],
            run_at: 'document_start',
        },
    ],
    icons: {
        128: 'assets/icon.png',
    },
    web_accessible_resources: [
        'style.css',
        'content-script.iife.js.map',
        'src/background/index.js.map',
        // anything in assets folder is dynamically added here
    ],
};

export default manifest;
