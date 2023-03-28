import { PluginOption } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

interface MakeManifestProps {
    buildName: string;
    outDir: string;
}

export default function buildComplete({
    buildName = 'base',
    outDir = '.cache/build/prod',
}: MakeManifestProps): PluginOption {
    return {
        name: 'build-complete',
        closeBundle() {
            const metaDir = path.join(outDir, 'meta');
            if (!fs.existsSync(metaDir)) {
                fs.mkdirSync(metaDir);
            }

            fs.writeFileSync(path.join(outDir, 'meta', buildName), 'complete', 'utf-8');
        },
    };
}
