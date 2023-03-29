import { Command, Option } from 'commander';
import { exec, execSync } from 'child_process';

const program = new Command();

function streamStdOutput(childProcess, prefix, color = 'white') {
    const colors = {
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        magenta: 35,
        cyan: 36,
        white: 37,
        gray: 90,
    };

    const colorCode = colors[color] || 37;

    childProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');

        lines.forEach((line) => {
            if (line) {
                console.log(`\u001b[${colorCode}m[${prefix}]\u001b[0m ${line}`);
            }
        });
    });

    childProcess.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');

        lines.forEach((line) => {
            if (line) {
                console.log(`\u001b[${colorCode}m[${prefix}]\u001b[0m ${line}`);
            }
        });
    });
}

program
    .command('dev')
    .version('0.0.1')
    .addOption(
        new Option('-m, --mode <string>', 'Production or development mode')
            .choices(['development', 'dev', 'production', 'prod'])
            .default('dev'),
    )
    .addOption(
        new Option('-b, --browser <string>', 'Browser to run')
            .choices(['chromium', 'firefox'])
            .default('chromium'),
    )
    .action((options) => {

        const outDir = ['dev', 'development'].includes(options.mode) ? '.cache/build/dev' : '.cache/build/prod';

        const browser = options.browser === 'chromium' ? 'chromium' : 'firefox-desktop';

        execSync(`npx rimraf ${outDir}`);

        const buildCommand = `npx concurrently --names "base,content" "npx vite build --mode ${options.mode} --watch" "npx vite build --mode ${options.mode} --watch -c vite.content.config.ts"`;
        const buildRunner = exec(buildCommand);

        streamStdOutput(buildRunner, 'build', 'green');

        const target = `--target=${browser}`;

        const browserCommand = `npx wait-on ${outDir}/meta/base ${outDir}/meta/content && npx web-ext run ${target} --source-dir=${outDir}`;
        const browserRunner = exec(browserCommand);

        streamStdOutput(browserRunner, 'browser', 'blue');
    });

program
    .command('build')
    .addOption(
        new Option('-m, --mode <string>', 'Production or development mode')
            .choices(['development', 'dev', 'production', 'prod'])
            .default('development'),
    )
    .addOption(
        new Option('-w, --watch', 'Watch for changes')
            .default(false),
    )
    .action((options) => {
        const outDir = ['dev', 'development'].includes(options.mode) ? '.cache/build/dev' : '.cache/build/prod';

        execSync(`npx rimraf ${outDir}`);

        const buildCommand = `npx concurrently --names "base,content" "npx vite build --mode ${options.mode} ${options.watch ? '--watch' : ''}" "npx vite build --mode ${options.mode} --watch -c vite.content.config.ts"`;
        const buildRunner = exec(buildCommand);

        streamStdOutput(buildRunner, 'build', 'green');
    });

program
    .command('build:zip')
    .addOption(
        new Option('-m, --mode <string>', 'Production or development mode')
            .choices(['development', 'dev', 'production', 'prod'])
            .default('production'),
    )
    .action((options) => {
        const outDir = ['dev', 'development'].includes(options.mode) ? '.cache/build/dev' : '.cache/build/prod';

        execSync(`npx rimraf ${outDir}`);

        const buildCommand = `npx concurrently --names "base,content" "npx vite build --mode ${options.mode} " "npx vite build --mode ${options.mode} --watch -c vite.content.config.ts"`;
        const buildRunner = exec(buildCommand);

        streamStdOutput(buildRunner, 'build', 'green');

        // build the two configs, then zip with web-ext
        const zipCommand = `npx wait-on ${outDir}/meta/base ${outDir}/meta/content && npx web-ext build --overwrite-dest --artifacts-dir .cache/build/zip --source-dir=${outDir}`;
        const zipRunner = exec(zipCommand);

        streamStdOutput(zipRunner, 'zip', 'yellow');
    });


program.parse(process.argv);
