/* eslint-disable no-console */

const util = require('util');
const { exec } = require('child_process');

const execPromisified = util.promisify(exec);

const createBuildCommandForPackage = p => {
    return `yarn workspace @aryzing/${p} run build`;
};

const buildPackage = p => execPromisified(createBuildCommandForPackage(p));

const packagesBuildOrder = [
    'foo-pkg',
    'bar-pkg',
];

const buildPackages = async () => {
    console.log('Starting to build @aryzing/* packages...');
    try {
        for (const p of packagesBuildOrder) {
            console.log(`Building ${p}`);
            await buildPackage(p);
        }
        console.log('Finished building @aryzing/* packages.');
    } catch (e) {
        console.error(e);
        console.error(
            'Error a39aca18-e18f-4628-aebc-a89794e97e81: Unable to build packages.'
        );
        console.error('Terminating package build.');
        process.exit(1);
    }
};

buildPackages();
