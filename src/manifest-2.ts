import { Manifest } from 'webextension-polyfill';

import mv3 from './manifest-3';

// manifest v2 version
const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: mv3.name,
    version: mv3.version,
    description: mv3.description,
    background: {
        page: 'src/background/index.html',
    },
    permissions: mv3.permissions,
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
    icons: mv3.icons,
    web_accessible_resources: [
        'style.css',
        'content-script.iife.js.map',
        'src/background/index.js.map',
        // anything in assets folder is dynamically added here
    ],
};

export default manifest;
