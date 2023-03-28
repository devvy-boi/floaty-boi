import { Manifest } from 'webextension-polyfill';

type CustomManifest = Manifest.WebExtensionManifest & {
    web_accessible_resources: {
        resources: string[];
        matches: string[];
    }[];
    externally_connectable?: {
        matches: string[];
    }
};

const manifest: CustomManifest = {
    manifest_version: 3,
    name: 'Floaty Boi',
    version: '0.0.1',
    description: 'Unofficial Floatplane quality of life extension',
    background: {
        service_worker: 'src/background/index.js',
        type: 'module',
    },
    permissions: [
        'storage',
    ],
    action: {
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
        {
            resources: [
                'style.css',
                'content-script.iife.js.map',
                'src/background/index.js.map',
                // anything in assets folder is dynamically added here
            ],
            matches: ['<all_urls>'],
        },
    ],
};

export default manifest;
