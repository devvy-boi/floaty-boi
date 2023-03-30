//configure dotenv
import dotenv from 'dotenv';
dotenv.config();

import { PluginOption } from 'vite';
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import manifestV3 from '../manifest-3';
import manifestV2 from '../manifest-2';

export default function makeManifest(outDir: string): PluginOption {
    return {
        name: 'make-manifest',
        closeBundle() {
            // get all the files in the assets folder
            const files = readdirSync(path.join(outDir, 'assets'));


            

            if (process.env.MANIFEST_VERSION === '2') {
                const baseResources = manifestV2.web_accessible_resources;

                // add the files to the manifest
                manifestV2.web_accessible_resources = [
                    ...baseResources,
                    ...files.map((file) => `assets/${file}`),
                ];
                writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifestV2, null, 4), 'utf-8');
            } else {
                const baseResources = manifestV3.web_accessible_resources[0].resources;

                // add the files to the manifest
                manifestV3.web_accessible_resources[0].resources = [
                    ...baseResources,
                    ...files.map((file) => `assets/${file}`),
                ];
                writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifestV3, null, 4), 'utf-8');
            }

            
        },
    };
}
